# OutfitCheck

Aplicativo mobile para cadastrar as roupas que você tem, guardar uma lista das roupas que quer comprar (wishlist), montar outfits e receber sugestões de outfit ao chacoalhar o celular.

## Visão Geral e Requisitos

**Tema.** Organizar o guarda-roupa: saber o que se tem, o que falta comprar e como combinar as peças.

**Objetivos**

- Registrar roupas com foto, categoria, marca, tamanho, estilo e observações.
- Manter uma wishlist com preço, link da loja e prioridade, e transformar um item em roupa quando ele for comprado.
- Montar outfits escolhendo peças do guarda-roupa.
- Ajudar a decidir o que vestir, sugerindo um outfit quando o celular é chacoalhado.

**Requisitos da disciplina**

| Requisito | Como o app atende |
|---|---|
| Pelo menos 6 telas | Início, Roupas, Wishlist, Outfits, Perfil, formulário de item (adicionar e editar), construtor de outfit e sugestão de outfit. São 8 telas, mais a tela de login |
| React Navigation | Navegação por abas (5 abas) e uma pilha (stack) dentro de Roupas, Wishlist e Outfits |
| Imagens | Fotos das roupas e do perfil, tiradas com a câmera ou escolhidas da galeria |
| UI e UX estilizadas | Cards, chips de seleção, estados de carregamento, erro e lista vazia, confirmação antes de excluir, mensagens de validação |
| Banco de dados com CRUD completo | Firebase Realtime Database: criar, ler, atualizar e excluir roupas, itens da wishlist, outfits e perfil |
| Pelo menos um sensor ou atuador | Acelerômetro (chacoalhar para sugerir um outfit) e vibração (atuador, ao mostrar a sugestão) |

## Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| JavaScript, React e React Native | Linguagem e base do aplicativo |
| Expo (testado com Expo Go em um iPhone) | Execução e acesso a recursos do aparelho |
| React Navigation (`bottom-tabs` e `native-stack`) | Abas e pilhas de telas |
| Firebase Realtime Database | Banco de dados |
| Firebase Authentication | Login com e-mail e senha, ou sem conta (anônimo) |
| `@react-native-async-storage/async-storage` | Manter o login entre aberturas do app |
| `expo-image-picker` | Câmera e galeria |
| `expo-sensors` (Accelerometer) | Detectar o movimento de chacoalhar |
| `Vibration` (React Native) | Vibração do celular (atuador) |

## Funcionalidades

**Login e conta**

- Entrar ou criar conta com e-mail e senha, ou continuar sem conta.
- Quem usa o app sem conta pode criar uma conta depois, na tela Perfil. Os dados já salvos são mantidos, porque a conta anônima é convertida em vez de substituída.
- Quem tem conta pode sair pela tela Perfil. Cada conta enxerga apenas os próprios dados.

**Início**

- Contadores de roupas, itens da wishlist e outfits. Tocar em um contador abre a aba correspondente.
- Um card que abre a tela de sugestão de outfit.

**Roupas**

- Lista com foto (ou a inicial do nome quando não há foto), nome, categoria, marca, estilo e tamanho.
- Filtro por categoria. Tocar na categoria selecionada limpa o filtro.
- Adicionar, editar e excluir. A exclusão pede confirmação.
- Excluir uma roupa também a remove dos outfits que a usam, e apaga o outfit que ficar vazio.
- Estados de carregamento, de erro (com botão para tentar novamente) e de lista vazia.

**Formulário de item** (usado em Roupas e na Wishlist)

- Campos: foto, nome e categoria (obrigatórios), marca, tamanho, estilo e observações.
- Na wishlist, também preço, link da loja e prioridade (baixa, média ou alta).
- Foto pela câmera ou pela galeria, com opção de remover.
- Validação: nome e categoria obrigatórios, preço precisa ser um número válido. Os textos são limpos de espaços e os campos vazios não são enviados.
- Ao editar, um campo que o usuário esvaziou é apagado no banco.

**Wishlist**

- Mesma lista, filtro e formulário de Roupas, mostrando preço e prioridade.
- "Marcar como comprado": o item vira uma roupa (sem preço, link e prioridade) e sai da wishlist.

**Outfits**

- Lista com nome, ocasião e quantidade de peças.
- Construtor: nome, ocasião e seleção de peças tocando nos cards. As peças escolhidas ficam destacadas e há um contador.
- Criar, editar e excluir outfits. Excluir um outfit não apaga as roupas.

**Sugestão de outfit (sensor e atuador)**

- Para partes de cima, partes de baixo e calçados, o usuário escolhe um estilo (opcional).
- Ao chacoalhar o celular, ou tocar em "Sugerir", o app sorteia uma peça de cada parte, usando só as roupas do estilo escolhido, e evita repetir a peça anterior.
- O acelerômetro detecta o movimento. Um intervalo de 1 segundo evita várias sugestões de um único movimento, e o sensor só fica ativo enquanto a tela está aberta.
- O celular vibra quando uma sugestão aparece.
- Se nenhuma roupa combinar com o estilo, a tela avisa. A sugestão pode ser salva como outfit.

**Perfil**

- Nome e foto, com criação na primeira vez e edição depois.
- Estatísticas: quantidade de roupas, itens da wishlist e outfits, e o valor total da wishlist.
- Gerenciamento da conta (criar conta ou sair).

**Histórico de versões**

- Cada atualização grava uma nova versão do item, e as anteriores ficam guardadas no banco.

## Arquitetura

O fluxo de dados segue um único sentido:

`tela` → `send(entidade, ação, dados)` → `router` → `validação` → `arquivo de ações` → `storage` → `Firebase`

| Pasta | Conteúdo |
|---|---|
| `screens/` | Uma tela por arquivo. As telas só chamam `send`. |
| `components/` | Cards, formulário de item, campo de imagem e estado vazio |
| `navigation/` | Navegador de abas e uma pilha por aba |
| `context/` | Provedor que cuida do login e expõe `send` e o usuário |
| `services/` | Router, validação, um arquivo de ações por entidade e o único arquivo que acessa o banco (`storage.js`) |
| `config/` | Constantes (categorias, estilos, regras dos campos) e a configuração do Firebase |

Caminho no banco: `users/{uid}/{entidade}/{id}/{versão com 6 dígitos}`.

## Demonstração

[Vídeo da demonstração](https://youtube.com/shorts/8xWu1Yd5o_M)

## Instalação e Execução

**Pré-requisitos:** Node.js, o app Expo Go no celular e uma conta no Firebase.

1. Clone o repositório e entre na pasta do projeto.
2. Instale as dependências: `npm install`
3. No Firebase, crie um projeto com um **Realtime Database**. Em Authentication, ative os métodos **E-mail/senha** e **Anônimo**.
4. Coloque as configurações do seu projeto Firebase em `config/firebase.js`. O arquivo deve exportar `db` e `auth`.
5. Inicie o app: `npx expo start` (use `-c` para limpar o cache).
6. Escaneie o QR code com o Expo Go. A câmera e o acelerômetro precisam de um aparelho real.

Para adicionar pacotes use `npx expo install <pacote>`, e não `npm install`.

## Aprendizados e Próximos Passos

**Aprendizados**

- Manter o fluxo de dados em um único sentido (tela, router, ação, storage) deixou cada tela pequena e fácil de mudar, e concentrou a validação em um só lugar.
- Um listener de sensor guarda o estado que existia quando foi criado. Por isso ele chama a função mais recente por meio de uma referência (`useRef`) e precisa ser removido quando a tela perde o foco.
- Uma `FlatList` só redesenha as linhas quando os dados mudam, então o estado de seleção precisa ser passado em `extraData`.
- Em uma atualização, um campo omitido mantém o valor antigo e `null` apaga o campo. Os formulários precisam enviar `null` para o que o usuário limpou.
- Converter uma conta anônima em conta com e-mail mantém o mesmo identificador, e os dados continuam disponíveis.

**Próximos passos**

- Guardar as fotos no Firebase Storage. Hoje são caminhos locais, que podem sumir se o app for reinstalado ou o cache for limpo.
- Restringir as regras do banco para que cada usuário leia e escreva apenas em `users/{seu uid}`.
- Recuperação de senha por e-mail e login com Google ou Apple.
- Revisão visual com uma paleta de cores consistente.
- Mostrar as fotos das peças nos cards de outfit.
- Salvar as operações com várias gravações (como "marcar como comprado") de forma atômica.

## Uso de Inteligência Artificial


Foi usado o assistente de IA, para:

- Explicar conceitos e bibliotecas, e orientar a organização das telas.
- Revisar código: encontrar imports faltando ou errados, `await` esquecido, nomes de campos errados e problemas de layout.
- Ajudar com alterações: Exemplos sem relação com o projeto proposto de funcionamento de Accelerometer e outras funcionalidades , para melhor entendimento das bibliotecas e código.
- Melhorar parte estética e conexxão com cores e estilos.


