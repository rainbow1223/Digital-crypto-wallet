import React, { useState } from "react";
import { useDispatch } from "react-redux";
import HeadingModule from "../../component/Layout/Header";
import { addWalletAction, checksumVaildateAction } from "../../store/slice/authSlice";
import { addBalanceAll } from "../../store/slice/balanceSlice";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";

const AddWallet = () => {
  const dispatch = useDispatch();
  const [wordArray, setWordArray] = useState(Array(12).fill(''));

  const addHandler = () => {
    let newMnemonic = wordArray.join(' ');
    let validated = checksumVaildateAction([newMnemonic]);
    if (validated.length > 0) {
      // add
      dispatch(addWalletAction({
        params: [newMnemonic],
        cb: (err, response) => {
          if (err) {
            console.log(err);
          }
          if (response) {
            toast.success('Valid mnemonics', { autoClose: 1500 });
            setWordArray(Array(12).fill(''));
            dispatch(addBalanceAll({ params: response }));
          }
        }
      }));

    } else {
      toast.error("Invalid mnemonics! Try other one.", { autoClose: 1500 })
    }
  }

  const inputChanged = (value, ind) => {
    // console.log(value, ind)
    let inputArray = value.split(' ');
    let wordArray_ = [...wordArray];
    for (let i = ind; i < 12; i++) {
      if (i === 11) {
        if (inputArray.length > 0)
          wordArray_[i] = inputArray.join(' ');
      } else {
        if (inputArray.length === 0) {
          break;
        }
        wordArray_[i] = inputArray[0];
        inputArray = inputArray.filter((value, index) => (index === 0 ? false : true));
      }
    }
    setWordArray(wordArray_);
  }

  return (
    <>
      <section className="zl_restore_wallet_page">
        <HeadingModule name={"Add Wallet"} />
        <div className="zl_restore_wallet_input_content">
          <div className="zl_securebackup_row row">
            {wordArray
              .map((word, i) => (
                <div
                  className="zl_securebackup_col_3 col-lg-3 col-md-6"
                  key={i}
                >
                  <div className="zl_securebackup_input_content position-relative">
                    <p className="zl_securebackup_input_text">{i + 1}</p>
                    <input
                      type="text"
                      className="zl_securebackup_input"
                      name={`input${i + 1}`}
                      value={word}
                      onChange={(e) => inputChanged(e.target.value, i)}
                      placeholder="________"
                    />
                  </div>
                </div>
              ))}
          </div>
          <div className="zl_securebackup_btn">
            {/* {err && <span className="err_text">{err}</span>} */}
            <Link to="#" className="mx-auto" onClick={addHandler}>
              Add
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddWallet;
