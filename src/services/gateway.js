// Este serviço simula uma API de pagamento real (como Stripe ou Mercado Pago)
// Em um projeto real, estas chamadas seriam para o seu servidor Backend (Node.js/Python)

export const PaymentGateway = {
    async processarPagamento(dadosCartao, valorTotal) {
        return new Promise((resolve, reject) => {
            console.log("Conectando ao Gateway de Pagamento Seguro...");
            
            // Simula latência de rede (2.5 segundos)
            setTimeout(() => {
                const randomChance = Math.random();
                
                // Validações básicas simuladas de servidor
                if (!dadosCartao.numero || dadosCartao.numero.length < 16) {
                    return reject({ erro: "cartao_invalido", mensagem: "Número do cartão inválido." });
                }

                // Simula cenários de erro reais para teste
                // 10% de chance de falha por "Saldo Insuficiente"
                if (randomChance < 0.1) {
                    return reject({ erro: "saldo_insuficiente", mensagem: "Transação negada: Saldo insuficiente." });
                }

                // 5% de chance de falha por "Timeout"
                if (randomChance > 0.1 && randomChance < 0.15) {
                    return reject({ erro: "timeout", mensagem: "O banco emissor não respondeu. Tente novamente." });
                }

                // Sucesso: Retorna um ID de transação falso (Hash)
                const transactionId = "TX-" + Math.random().toString(36).substr(2, 9).toUpperCase();
                
                resolve({
                    sucesso: true,
                    transactionId: transactionId,
                    mensagem: "Pagamento aprovado com sucesso.",
                    data: new Date().toISOString()
                });

            }, 2500);
        });
    }
};