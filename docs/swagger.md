# Documentação da API com Swagger

A API expõe uma interface interativa em Swagger para facilitar a exploração dos endpoints.

## Acessando

- **URL base:** `http://localhost:3000/docs`
- O endpoint é configurado em `src/main.ts` através do `SwaggerModule.setup('docs', app, document);`.
- Os assets estáticos do Swagger UI são servidos com o prefixo `/docs`.

## Como atualizar

1. Verifique as anotações do `@nestjs/swagger` nos controllers e DTOs.
2. Ajuste o `DocumentBuilder` em `main.ts` para alterar título, versão ou metadados.
3. Reinicie a aplicação (`npm run start:dev`) para refletir as mudanças.

## Boas práticas

- Documente cada endpoint com `@ApiTags`, `@ApiOperation`, `@ApiResponse`, etc.
- Garanta que DTOs estejam anotados com `@ApiProperty` para gerar exemplos.
- Utilize autenticação simulada (se necessário) diretamente pela interface Swagger para testar fluxos protegidos.
