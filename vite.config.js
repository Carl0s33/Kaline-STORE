import path from 'node:path';
import react from '@vitejs/plugin-react';

import fs from 'fs';
import { createLogger, defineConfig } from 'vite';

const configHorizonsViteErrorHandler = `
const observer = new MutationObserver((mutations) => {
	for (const mutation of mutations) {
		for (const addedNode of mutation.addedNodes) {
			if (
				addedNode.nodeType === Node.ELEMENT_NODE &&
				(
					addedNode.tagName?.toLowerCase() === 'vite-error-overlay' ||
					addedNode.classList?.contains('backdrop')
				)
			) {
				handleViteOverlay(addedNode);
			}
		}
	}
});

observer.observe(document.documentElement, {
	childList: true,
	subtree: true
});

function handleViteOverlay(node) {
	if (!node.shadowRoot) {
		return;
	}

	const backdrop = node.shadowRoot.querySelector('.backdrop');

	if (backdrop) {
		const overlayHtml = backdrop.outerHTML;
		const parser = new DOMParser();
		const doc = parser.parseFromString(overlayHtml, 'text/html');
		const messageBodyElement = doc.querySelector('.message-body');
		const fileElement = doc.querySelector('.file');
		const messageText = messageBodyElement ? messageBodyElement.textContent.trim() : '';
		const fileText = fileElement ? fileElement.textContent.trim() : '';
		const error = messageText + (fileText ? ' File:' + fileText : '');

		window.parent.postMessage({
			type: 'horizons-vite-error',
			error,
		}, '*');
	}
}
`;

const configHorizonsRuntimeErrorHandler = `
window.onerror = (message, source, lineno, colno, errorObj) => {
	const errorDetails = errorObj ? JSON.stringify({
		name: errorObj.name,
		message: errorObj.message,
		stack: errorObj.stack,
		source,
		lineno,
		colno,
	}) : null;

	window.parent.postMessage({
		type: 'horizons-runtime-error',
		message,
		error: errorDetails
	}, '*');
};
`;

const configHorizonsConsoleErrroHandler = `
const originalConsoleError = console.error;
console.error = function(...args) {
	originalConsoleError.apply(console, args);

	let errorString = '';

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg instanceof Error) {
			errorString = arg.stack || \`\${arg.name}: \${arg.message}\`;
			break;
		}
	}

	if (!errorString) {
		errorString = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
	}

	window.parent.postMessage({
		type: 'horizons-console-error',
		error: errorString
	}, '*');
};
`;

const configWindowFetchMonkeyPatch = `
const originalFetch = window.fetch;

window.fetch = function(...args) {
	const url = args[0] instanceof Request ? args[0].url : args[0];

	// Skip WebSocket URLs
	if (url.startsWith('ws:') || url.startsWith('wss:')) {
		return originalFetch.apply(this, args);
	}

	return originalFetch.apply(this, args)
		.then(async response => {
			const contentType = response.headers.get('Content-Type') || '';

			// Exclude HTML document responses
			const isDocumentResponse =
				contentType.includes('text/html') ||
				contentType.includes('application/xhtml+xml');

			if (!response.ok && !isDocumentResponse) {
					const responseClone = response.clone();
					const errorFromRes = await responseClone.text();
					const requestUrl = response.url;
					console.error(\`Fetch error from \${requestUrl}: \${errorFromRes}\`);
			}

			return response;
		})
		.catch(error => {
			if (!url.match(/\.html?$/i)) {
				console.error(error);
			}

			throw error;
		});
};
`;

const addTransformIndexHtml = {
	name: 'add-transform-index-html',
	transformIndexHtml(html) {
		return {
			html,
			tags: [
				{
					tag: 'script',
					attrs: { type: 'module' },
					children: configHorizonsRuntimeErrorHandler,
					injectTo: 'head',
				},
				{
					tag: 'script',
					attrs: { type: 'module' },
					children: configHorizonsViteErrorHandler,
					injectTo: 'head',
				},
				{
					tag: 'script',
					attrs: {type: 'module'},
					children: configHorizonsConsoleErrroHandler,
					injectTo: 'head',
				},
				{
					tag: 'script',
					attrs: { type: 'module' },
					children: configWindowFetchMonkeyPatch,
					injectTo: 'head',
				},
			],
		};
	},
};

console.warn = () => {};

const logger = createLogger()
const loggerError = logger.error

logger.error = (msg, options) => {
	if (options?.error?.toString().includes('CssSyntaxError: [postcss]')) {
		return;
	}

	loggerError(msg, options);
}

// Função auxiliar para ler o corpo da requisição
function getPostBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

const productsFilePath = path.resolve(__dirname, 'src/data/produtos.js');

function updateProductsPlugin() {
  return {
    name: 'update-products-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/save-product' && req.method === 'POST') {
          try {
            const requestData = await getPostBody(req);
            const { action, payload } = requestData;
            
            let fileContent = fs.readFileSync(productsFilePath, 'utf8');
            
            // Extrai o array de produtos atual. Isso é frágil e assume uma estrutura específica.
            const productsMatch = fileContent.match(/const products = (\n*\s*)(\[[\s\S]*?\]);/m);
            if (!productsMatch || !productsMatch[2]) {
              console.error('Could not parse products array from produtos.js');
              res.statusCode = 500;
              res.end(JSON.stringify({ message: 'Could not parse produtos.js' }));
              return;
            }

            let products;
            try {
              // Tenta avaliar o array de produtos. CUIDADO: eval é arriscado.
              // Uma alternativa mais segura seria usar uma biblioteca para analisar JS ou converter produtos.js para JSON.
              products = eval('(' + productsMatch[2] + ')'); 
            } catch (e) {
              console.error('Error evaluating products array:', e);
              res.statusCode = 500;
              res.end(JSON.stringify({ message: 'Error evaluating products array from produtos.js' }));
              return;
            }

            if (action === 'add') {
              const newId = String(products.length > 0 ? Math.max(...products.map(p => parseInt(p.id))) + 1 : 1);
              products.push({ ...payload, id: newId });
            } else if (action === 'update') {
              const index = products.findIndex(p => String(p.id) === String(payload.id));
              if (index !== -1) {
                products[index] = { ...products[index], ...payload };
              } else {
                // Produto não encontrado para atualização, pode optar por adicionar ou retornar erro
                // products.push(payload); // Adiciona se não encontrar
                console.warn(`Product with ID ${payload.id} not found for update.`);
                // Não faz nada ou retorna erro específico
              }
            } else {
              res.statusCode = 400;
              res.end(JSON.stringify({ message: 'Invalid action' }));
              return;
            }

            const newProductsArrayString = JSON.stringify(products, null, 2); // Pretty print
            const updatedFileContent = fileContent.replace(
              /const products = (\n*\s*)(\[[\s\S]*?\]);/m, 
              `const products = ${productsMatch[1]}${newProductsArrayString};`
            );

            fs.writeFileSync(productsFilePath, updatedFileContent, 'utf8');
            
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Product saved successfully' }));
          } catch (error) {
            console.error('Error saving product:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ message: 'Error saving product', error: error.message }));
          }
        } else {
          next();
        }
      });
    }
  };
}

// Configuração para GitHub Pages
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
const base = isGitHubPages ? '/Kaline-STORE/' : '/';

export default defineConfig({
  base,
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          vendor: ['framer-motion', 'lucide-react'],
        },
      },
    },
  },
  customLogger: logger,
  plugins: [react(), updateProductsPlugin(), addTransformIndexHtml],
	server: {
		cors: true,
		headers: {
			'Cross-Origin-Embedder-Policy': 'credentialless',
		},
		allowedHosts: true,
	},
	resolve: {
		extensions: ['.jsx', '.js', '.tsx', '.ts', '.json', ],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
