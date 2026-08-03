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
    match /ciclos/{docId} {
      allow read, write: if request.auth != null;
    }
    match /participacoes/{docId} {
      allow read, write: if request.auth != null;
    }
    match /config/{docId} {
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

## 6. Aba Pontuação — como funciona por baixo dos panos

- **Ciclos:** os 9 ciclos do 2º período (do print que você mandou) são criados automaticamente no Firestore (coleção `ciclos`) na primeira vez que a aba Pontuação é aberta. Se algum dia você quiser cadastrar os ciclos de um período novo, é só criar documentos novos na coleção `ciclos` do jeito Firebase Console mesmo (posso te ajudar quando chegar a hora, ou fazer uma telinha pra isso).
- **Pedido / Ativa / Inativa:** marcar "Pedido feito" (ou clicar no selo Ativa) grava na coleção `participacoes` (um registro por consultora + ciclo) e, **só quando é o ciclo atual**, também atualiza o campo Ativo do cadastro dela.
- **Pontos:** o botão `+`/`-` usa o valor que você digitar na caixinha ao lado como a quantidade a somar/subtrair, e já atualiza direto o campo Pontos do cadastro (e o nível muda sozinho, do jeito que você pediu).
- **Virada automática de ciclo:** toda vez que o app é aberto, ele confere se a data de hoje já entrou num ciclo novo. Se sim, para cada consultora que **não fez pedido** no ciclo que fechou, o contador de inatividade sobe +1; quem fez pedido volta pro contador 1. Quem chegar a 6 ciclos inativos seguidos e continuar sem pedido é marcada automaticamente como **Cancelada** (não é apagada — fica visível na lista com um botão "Reativar / recadastrar").
- Essa parte da virada automática é a mais delicada de acertar de primeira — como combinado, vamos testando e ajustando junto.


- **Botão "Excluir" na ficha de cadastro (registro novo):** como ainda não existe nada salvo nesse ponto, fiz ele limpar o rascunho inteiro e fechar a ficha (equivalente a descartar), diferente do **Apagar**, que só limpa o texto digitado sem fechar. Se você quiser que "Excluir" faça outra coisa aqui, me fala.
- **Data do cadastro:** preenchi automaticamente com a data de hoje e deixei travada (não editável), pra não bagunçar a contagem de dias. Se quiser que dê pra editar manualmente, eu libero.
- **Pontos e Nível:** deixei como campos editáveis manualmente por enquanto (aparecem vazios até você preencher), já que você disse que o sistema de período/pontuação automática vai ser definido na segunda aba.
- **Contagem de dias (Ativo/Inativo):** conta a partir da última vez que o status foi alterado (na criação do cadastro, já começa contando a partir da data de criação, como você pediu).
