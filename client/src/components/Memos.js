import { useState, useEffect } from "react";
import axios from "axios";
const Memos = () => {
  const [paymentInputs, setPaymentInputs] = useState([]);
  // const { contract } = state;

  // update it every minute and when send sign
  useEffect(() => {
    const memosMessage = async () => {
      try {
        setInterval(async () => {
          const res = await axios.get("http://localhost:4000/relayTransaction");
          setPaymentInputs(res.data);
        }, 3000);
      } catch (e) {
        alert(e);
      }
    };
    memosMessage();
  }, []);

  return (
    <>
      <h5 style={{ textAlign: "center", marginTop: "20px" }}>
        Payments In Queue
      </h5>

      <div className="table-responsive-sm">
        <table className="table table-sm table-striped table-hover ">
          <thead>
            <tr>
              <th scope="col">Sender</th>
              <th scope="col">Receiver</th>
              <th scope="col">Token Address</th>
            </tr>
          </thead>
          <tbody>
            {paymentInputs.map((memo) => (
              <tr key={Math.random()}>
                <td>{memo[0]}</td>
                <td>{memo[1]}</td>
                <td>{memo[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default Memos;
