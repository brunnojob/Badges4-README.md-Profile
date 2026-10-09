# Badge Toolkit

Renderização local de badges SVG e auditoria de URLs em Markdown. Texto e atributos recebem escape; cores e tamanhos são validados.

## Executar

Requisito: Node.js 24.

```sh
node --test tests/*.test.mjs
node tools/badge.mjs render build passing build.svg green
node tools/badge.mjs audit README.md
```

A auditoria identifica transporte inseguro, credenciais embutidas, campos longos e estilos inválidos. A renderização funciona sem serviço externo.

## Catálogo

O catálogo original está em [docs/catalog.md](docs/catalog.md). Este repositório deriva de Badges4-README.md-Profile; a licença e os arquivos de atribuição originais são preservados.
