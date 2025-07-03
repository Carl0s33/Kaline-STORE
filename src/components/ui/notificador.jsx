import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from '@/components/ui/notificacao';
import { useNotificacao } from '@/components/ui/useNotificacao';
import React from 'react';

export function Toaster() {
	const { notificacoes } = useNotificacao();

	return (
		<ToastProvider>
			{notificacoes.map(({ id, title, description, action, dismiss, update, ...props }) => {
				return (
					<Toast key={id} {...props}>
						<div className="grid gap-1">
							{title && <ToastTitle>{title}</ToastTitle>}
							{description && (
								<ToastDescription>{description}</ToastDescription>
							)}
						</div>
						{action}
						<ToastClose />
					</Toast>
				);
			})}
			<ToastViewport />
		</ToastProvider>
	);
}
