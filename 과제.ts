interface IPaymentStrategy {
    pay(amount: number): void;
} //인터페이스 정의

// 신용카드를 사용하는 결제
class CreditCardStrategy implements IPaymentStrategy {
    // 신용카드로 결제하는 메소드
    pay(amount: number): void {
        console.log(`Paid ${amount} using Credit Card`);
    } //인터페이스구현
}

class CashStrategy implements IPaymentStrategy {
    pay(amount: number): void {
        console.log(`Paid ${amount} in cash`);
    }
}

class BitcoinStrategy implements IPaymentStrategy {
    pay(amount: number): void {
        console.log(`Paid ${amount} using Bitcoin`);
    }
}

// 결제 처리하는 클래스 생성
class PaymentProcessor {
    private strategy: IPaymentStrategy;

    // 생성자해서 초기 결제
    constructor(strategy: IPaymentStrategy) {
        this.strategy = strategy;
    }

    // 결제 변경
    setStrategy(strategy: IPaymentStrategy) {
        this.strategy = strategy;
    }

    // 결제를 처리
    processPayment(amount: number): void {
        this.strategy.pay(amount);
    }
}

function main(): void {
    // 처음에는 신용카드 사용하는 결제 처리 생성
    let paymentProcessor = new PaymentProcessor(new CreditCardStrategy());
    //결제 처리
    paymentProcessor.processPayment(100);
    //결제 변경함 현금으로
    paymentProcessor.setStrategy(new CashStrategy());

    paymentProcessor.processPayment(50);

    paymentProcessor.setStrategy(new BitcoinStrategy());

    paymentProcessor.processPayment(200);
}

main();
