# 🥚 Guia de Configuração Admin - Páscoa Lucrativa

## 📋 Resumo das Funcionalidades Implementadas

### ✅ Painel Administrativo Completo
- **Gerenciamento de Usuários**: Visualize todos os usuários cadastrados na plataforma
- **Estatísticas Globais**: Acompanhe métricas de toda a plataforma (usuários ativos, pedidos totais, receita global)
- **Edição de Usuários**: Alterar senhas de usuários específicos
- **Exclusão de Usuários**: Remover usuários e todos os seus dados associados
- **Busca e Filtros**: Encontre usuários facilmente por email, nome ou confeitaria
- **Detalhes Completos**: Visualize informações detalhadas de cada usuário

### ✅ Template de Email Personalizado
- **Design Premium**: Email de confirmação com design elegante e profissional
- **Identidade da Marca**: Cores e estilo alinhados à identidade visual da Páscoa Lucrativa
- **Responsivo**: Funciona perfeitamente em desktop e mobile
- **Features Destacadas**: Mostra os principais benefícios da plataforma

---

## 🔧 Configuração do Supabase

### 1. Configurar Email Personalizado

#### Opção A: Usar SMTP Próprio (Recomendado)
1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Vá para **Authentication** > **Email Templates** > **Confirm signup**
3. Copie o conteúdo do arquivo `email-template.html`
4. Cole no editor de templates do Supabase
5. Configure as variáveis:
   - `{{ .ConfirmationURL }}` - Link de confirmação (já configurado pelo Supabase)

#### Opção B: Configurar SMTP Personalizado
1. Vá para **Settings** > **Authentication** no painel do Supabase
2. Clique em **Email Provider** e selecione **Custom SMTP**
3. Configure os seguintes campos:
   ```
   SMTP Host: smtp.seu-provedor.com
   SMTP Port: 587 (ou 465 para SSL)
   SMTP User: seu-email@dominio.com
   SMTP Password: sua-senha
   Sender Email: noreply@seu-dominio.com
   Sender Name: Páscoa Lucrativa
   ```

### 2. Configurar Permissões de Admin

O sistema de admin já está implementado no código. Para usar:

1. **Email Admin**: `assessoriablent@gmail.com`
2. **Acesso Admin**: Ao fazer login com este email, você será redirecionado automaticamente para o painel admin
3. **Chaves Necessárias**: Você precisará da `SERVICE_ROLE_KEY` do Supabase para operações administrativas

### 3. Atualizar Variáveis de Ambiente

No arquivo `.env`, adicione:

```env
# Supabase
VITE_SUPABASE_URL="https://ecbclssrsgzirvshmzqy.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Supabase Service Role Key (Necessário para operações admin)
# IMPORTANTE: Esta chave deve ser usada APENAS no backend, nunca exposta ao frontend
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key-do-supabase"
```

⚠️ **AVISO DE SEGURANÇA**: Nunca exponha a `SERVICE_ROLE_KEY` no código frontend. Esta chave dá acesso completo ao seu banco de dados.

---

## 🚀 Como Usar o Painel Admin

### Login como Admin
1. Acesse a aplicação
2. Use o email: `assessoriablent@gmail.com`
3. Digite sua senha
4. Você será redirecionado automaticamente para o painel administrativo

### Funcionalidades Disponíveis

#### 📊 Dashboard de Estatísticas
- **Total de Usuários**: Quantidade de usuários cadastrados
- **Usuários Ativos**: Usuários que acessaram nos últimos 30 dias
- **Pedidos Totais**: Soma de todos os pedidos da plataforma
- **Receita Total**: Valor total de todas as vendas

#### 👥 Gerenciamento de Usuários
- **Lista de Usuários**: Visualização em formato de tabela
- **Busca**: Encontre usuários por email, nome ou confeitaria
- **Filtros**: Filtre por status (ativos/inativos/todos)
- **Detalhes**: Clique no ícone de olho para ver informações completas
- **Ações Rápidas**: Alterar senha ou excluir usuário

#### 🔐 Alterar Senha de Usuário
1. Clique no ícone de olho no usuário desejado
2. Clique em "Alterar Senha"
3. Digite a nova senha (mínimo 6 caracteres)
4. Clique em "Confirmar"
5. O usuário poderá fazer login com a nova senha

#### 🗑️ Excluir Usuário
1. Clique no ícone de olho no usuário desejado
2. Clique em "Excluir Usuário"
3. Confirme a ação no modal
4. Todos os dados do usuário serão removidos permanentemente

---

## 🎨 Customização do Email Template

### Estrutura do Template
O template usa HTML5 moderno com CSS inline para compatibilidade máxima com clientes de email.

### Cores da Marca
- **Primária (Chocolate)**: `#2D241E`
- **Secundária (Dourado)**: `#D4AF37`
- **Background (Cream)**: `#FDFCFB`
- **Acento (Paper)**: `#F5F1E9`

### Como Personalizar
1. Abra o arquivo `email-template.html`
2. Modifique os textos conforme necessário
3. Mantenha a estrutura HTML e classes CSS
4. Teste em diferentes clientes de email antes de deployar

---

## 🔒 Segurança e Boas Práticas

### Proteção do Painel Admin
1. **Autenticação Forte**: O painel só é acessível pelo email admin configurado
2. **Tokens Seguros**: Use JWT tokens para autenticação administrativa
3. **Auditoria**: Log todas as ações administrativas
4. **Backup**: Faça backup regular dos dados de usuários

### Proteção de Dados
1. **GDPR/LGPD**: Esteja em conformidade com leis de proteção de dados
2. **Exclusão Segura**: Quando excluir um usuário, remova todos os dados pessoais
3. **Consentimento**: Mantenha registros de consentimento dos usuários

---

## 📞 Suporte e Manutenção

### Problemas Comuns

#### Email de Confirmação Não Chega
1. Verifique a pasta de spam
2. Confirme as configurações de SMTP
3. Teste o envio de email no painel do Supabase
4. Verifique se o domínio de email não está bloqueado

#### Painel Admin Não Acessível
1. Confirme que está usando o email correto: `assessoriablent@gmail.com`
2. Verifique se a senha está correta
3. Confirme que as permissões estão configuradas no Supabase
4. Verifique o console do navegador para erros

#### Erro ao Gerenciar Usuários
1. Verifique se tem a SERVICE_ROLE_KEY configurada
2. Confirme as permissões no Supabase (RLS policies)
3. Verifique a conexão com o banco de dados
4. Consulte os logs do Supabase para detalhes

---

## 🎯 Próximas Melhorias Sugeridas

1. **Notificações Push**: Alertas para novos cadastros
2. **Relatórios PDF**: Exportação de relatórios administrativos
3. **Auditoria Completa**: Log detalhado de todas as ações
4. **Autenticação 2FA**: Proteção adicional para o painel admin
5. **API Admin**: Endpoints REST para integrações externas
6. **Dashboard em Tempo Real**: Atualizações via WebSockets

---

## 📞 Contato

Para suporte ou dúvidas sobre a implementação:

- **Email**: assessoriablent@gmail.com
- **Documentação Supabase**: https://supabase.com/docs
- **Status do Sistema**: Verifique o painel do Supabase

---

**🥚 Transforme sua confeitaria em um império de Páscoa com Páscoa Lucrativa!**
