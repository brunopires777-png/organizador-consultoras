# Organizador de Consultoras — Como configurar

## 1. Criar o projeto no Firebase (separado do ESA)
1. Acesse https://console.firebase.google.com → **Adicionar projeto** → dê um nome (ex: `organizador-consultoras`).
2. Dentro do projeto: **Compilação → Authentication → Sign-in method** → ative **E-mail/senha**.
3. Em **Authentication → Users**, clique em **Add user** e cadastre o e-mail e senha que sua irmã vai usar pra entrar (pode cadastrar mais de um usuário se quiser).
4. **Compilação → Firestore Database → Criar banco de dados** → inicie em **modo produção**.
5. Em **Configurações do projeto (ícone de engrenagem) → Seus apps → Web (`</>`)** → registre um app e copie o objeto `firebaseConfig`.

## 2. Colar as credenciais no `index.html`
Abra `index.html`, procure por `const firebaseConfig = {` (perto do início do `<script type="module">`) e substitua os valores `"COLE_AQUI..."` pelos que você copiou no passo anterior.

## 3. Regras de segurança do Firestore
Em **Firestore Database → Regras**, cole isto (só usuários logados podem ler/escrever):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /consultoras/{docId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 4. Publicar
Suba a pasta inteira (`index.html`, `manifest.json`, `sw.js`, `icons/`) pro Render (ou qualquer host de arquivos estáticos), do mesmo jeito que você já faz com o ESA. Precisa estar em **HTTPS** pra instalar como app no celular.

## 5. Instalar no celular
No Android Chrome: abrir o site → menu (⋮) → **Adicionar à tela inicial** / **Instalar app**.

---

## Decisões que tomei e que valem confirmar com você

- **Botão "Excluir" na ficha de cadastro (registro novo):** como ainda não existe nada salvo nesse ponto, fiz ele limpar o rascunho inteiro e fechar a ficha (equivalente a descartar), diferente do **Apagar**, que só limpa o texto digitado sem fechar. Se você quiser que "Excluir" faça outra coisa aqui, me fala.
- **Data do cadastro:** preenchi automaticamente com a data de hoje e deixei travada (não editável), pra não bagunçar a contagem de dias. Se quiser que dê pra editar manualmente, eu libero.
- **Pontos e Nível:** deixei como campos editáveis manualmente por enquanto (aparecem vazios até você preencher), já que você disse que o sistema de período/pontuação automática vai ser definido na segunda aba.
- **Contagem de dias (Ativo/Inativo):** conta a partir da última vez que o status foi alterado (na criação do cadastro, já começa contando a partir da data de criação, como você pediu).
