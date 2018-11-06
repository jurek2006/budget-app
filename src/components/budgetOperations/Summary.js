import React, { Component } from "react";
import Currency from "../layout/Currency";

export class Summary extends Component {
    render() {
        const { operations, operationType } = this.props;
        const total = operations.reduce((a, b) => a + b.value, 0);
        switch (operationType) {
            case "expenses":
                return (
                    <div>
                        Wydatki:{" "}
                        <Currency
                            value={Math.abs(total)}
                            className="text-danger font-weight-bold"
                        />
                    </div>
                );
            case "incomes":
                return (
                    <div>
                        Wpływy:{" "}
                        <Currency
                            value={total}
                            className="text-success font-weight-bold"
                        />
                    </div>
                );
            default:
                const incomes = operations
                    .filter(o => o.value >= 0)
                    .reduce((a, b) => a + b.value, 0);
                return (
                    <div>
                        Suma:{" "}
                        <Currency value={total} className="font-weight-bold" />{" "}
                        w tym: wpływy{" "}
                        <Currency
                            value={incomes}
                            className="text-success font-weight-bold"
                        />
                        , wydatki{" "}
                        <Currency
                            value={Math.abs(total - incomes)}
                            className="text-danger font-weight-bold"
                        />
                    </div>
                );
        }
    }
}

export default Summary;
