
    import React from 'react';
    import { cn } from "@/lib/utilitarios";

    const Cartao = React.forwardRef(({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
        {...props} />
    ))
    Cartao.displayName = "Cartao"

    const CabecalhoCartao = React.forwardRef(({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props} />
    ))
    CabecalhoCartao.displayName = "CabecalhoCartao"

    const TituloCartao = React.forwardRef(({ className, children, ...props }, ref) => (
      <h3
        ref={ref}
        className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
        {...props}>
        {children}
      </h3>
    ))
    TituloCartao.displayName = "TituloCartao"

    const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
      <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props} />
    ))
    CardDescription.displayName = "CardDescription"

    const ConteudoCartao = React.forwardRef(({ className, ...props }, ref) => (
      <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
    ))
    ConteudoCartao.displayName = "ConteudoCartao"

    const RodapeCartao = React.forwardRef(({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props} />
    ))
    RodapeCartao.displayName = "RodapeCartao"

    export { Cartao, CabecalhoCartao, RodapeCartao, TituloCartao, CardDescription, ConteudoCartao }
  