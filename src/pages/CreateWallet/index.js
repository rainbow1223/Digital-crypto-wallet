import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants";
import { checksumVaildateAction, signupPageAction, createWalletAction } from "../../store/slice/authSlice";
import Select from 'react-select';
import Spinner from "react-bootstrap/Spinner";

const [SetPassword, EnteringNumber, EnteringWord, ChecksumValidating] = [1, 2, 3, 4];

const CreateWallet = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [numberArray, setNumberArray] = useState(Array(12).fill(''));
    const [valueArray, setValueArray] = useState(Array(12).fill([]));
    const [validatedWordSets, setValidatedWordSets] = useState([]);
    const [canMoveToChecksumValidating, setCanMoveToChecksumValidating] = useState(false);
    const [options, setOptions] = useState([]);
    const [inputValueArray, setInputValueArray] = useState(Array(12).fill(''));
    // const [visibleOptions, setVisibleOptions] = useState([]);
    const [walletChecked, setWalletChecked] = useState([]);


    useEffect(() => {
        signupPageAction();
        let wordlist = localStorage.getItem('wordlist');
        if (wordlist) {
            setOptions(wordlist.split(',').map(word => ({ value: word, label: word })));
            // setVisibleOptions(wordlist.split(',').map(word => ({ value: word, label: word })));
        }
    }, []);

    // console.log(isPasswordValid)
    useEffect(() => {
        if (currentStep === ChecksumValidating) {
            let validatedWordSets_ = valueArray[0].map(element => [element]);
            for (let i = 1; i < 12; i++) {
                let validatedWordSets__ = [...validatedWordSets_];
                validatedWordSets_ = [];
                valueArray[i].forEach(element => {
                    validatedWordSets_ = [...validatedWordSets_, ...validatedWordSets__.map(set => [...set, element])];
                });
            }
            // console.log(validatedWordSets_);
            let checksumed = checksumVaildateAction(validatedWordSets_.map(set => set.map(el => el.value).join(' ')));
            if (checksumed.length === 0) {
                setCurrentStep(EnteringWord);
            }
            setValidatedWordSets(checksumed);
            setWalletChecked(validatedWordSets_.map(set => true));
        }
    }, [currentStep]);

    const nextStep = async () => {
        setCurrentStep(currentStep >= ChecksumValidating ? ChecksumValidating : currentStep + 1);

        if (currentStep === ChecksumValidating) {
            dispatch(
                createWalletAction({
                    params: validatedWordSets.filter((set, index) => walletChecked[index]),
                    password: password,
                    cb: (err, response) => {
                        if (err) {
                            console.log("err", err);
                        }
                        if (response) {
                            navigate(routes.dashboardPage);
                        }
                    }
                })
            )
        }
    }

    const enteredNumberChange = (e, i) => {
        let num = parseInt(e.target.value);
        if (num < 1 || num >= 2048) return;
        setNumberArray(numberArray => [...numberArray.slice(0, i), e.target.value, ...numberArray.slice(i + 1, numberArray.length)]);
        // console.log(value, i)

    }

    const enteredValueChange = (e, i) => {
        let number = numberArray[i] ? numberArray[i] : 1;
        if (e.length > number)
            return;
        setValueArray([...valueArray.slice(0, i), e, ...valueArray.slice(i + 1, valueArray.length)]);

        // setVisibleOptions(options.filter(option => {
        //     for (let i = 0; i < valueArray.length; i++){
        //         if()
        //     }
        // }));
    }

    const inputChange = (e, i, valueArray_) => {
        let inputValue = e.split(' ');
        let number = numberArray[i] ? numberArray[i] : 1;
        // console.log(inputValue)
        let added = valueArray_[i].map(value => value.value);
        // console.log(['able', 'cable'].includes('ables'))
        // console.log(valueArray)
        let optionValues = options.map(option => option.value);
        // console.log(added)
        let rest = [];
        for (let j = 0; j < inputValue.length; j++) {
            // console.log(added.includes(inputValue[j]), options.includes(inputValue[j]));
            if ((!added.includes(inputValue[j])) && (optionValues.includes(inputValue[j])) && added.length < number) {
                added = [...added, inputValue[j]];
                rest = [];
                // inputValue = inputValue.filter((value, index) => index !== j);
            } else {
                rest = [...rest, inputValue[j]];
            }
        }
        // console.log(i, added)
        valueArray_[i] = added.map(value => ({ value: value, label: value }));
        if (added.length < number || i === 11) {
            setValueArray(valueArray_);
            setInputValueArray([...inputValueArray.slice(0, i), rest.join(' '), ...inputValueArray.slice(i + 1, inputValueArray.length)]);
        } else {
            inputChange(rest.join(' '), i + 1, valueArray_);
        }
    }

    useEffect(() => {
        let canMoveToChecksumValidating_ = true;
        for (let j = 0; j < valueArray.length; j++) {
            if (numberArray[j] === '') {
                if (valueArray[j].length === 0) {
                    canMoveToChecksumValidating_ = false;
                    break;
                }
            } else if (valueArray[j].length !== parseInt(numberArray[j])) {
                canMoveToChecksumValidating_ = false;
                break;
            }
        }
        // console.log(canMoveToChecksumValidating_)

        if (canMoveToChecksumValidating_) setCanMoveToChecksumValidating(true);
        else setCanMoveToChecksumValidating(false);
    }, valueArray);

    let loading = useSelector((state) => state.auth.loader);
    if (loading)
        return (
            <div><Spinner animation="border" variant="primary" /></div>
        );
    return (
        <section className="zl_login_section">
            <div className="zl_login_content container">
                <React.Fragment>
                    <SetPasswordStep password={password} setPassword={setPassword} setIsPasswordValid={setIsPasswordValid} currentStep={currentStep} />
                    <EnteringNumberStep currentStep={currentStep} enteredNumberChange={enteredNumberChange} numberArray={numberArray} />
                    <EnteringWordStep currentStep={currentStep} options={options} enteredValueChange={enteredValueChange} valueArray={valueArray} inputChange={inputChange} inputValueArray={inputValueArray} />
                    <ChecksumValidatingStep currentStep={currentStep} mnemonics={validatedWordSets} walletChecked={walletChecked} setWalletChecked={setWalletChecked} />
                </React.Fragment>

                <div className="zl_login_btn">
                    {<span className="err_text"></span>}
                    <button
                        className="mx-auto zl_login_btn_link"
                        onClick={nextStep}
                        disabled={((currentStep !== EnteringWord && currentStep !== SetPassword) || (currentStep === EnteringWord && canMoveToChecksumValidating) || (currentStep === SetPassword && isPasswordValid)) ? false : true}
                    >
                        Next
                    </button>
                </div>
            </div>
        </section>
    );
};

const SetPasswordStep = (props) => {
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordValidation, setPasswordValidation] = useState('');
    const [confirmPasswordValidation, setConfirmPasswordValidation] = useState('');

    const setPasswordHandler = (e) => {
        let password = e.target.value;
        let isPasswordValid = false;
        if (password.length >= 8) {
            if (password === confirmPassword)
                isPasswordValid = true;
            setPasswordValidation('');
        }
        else if (password.length === 0) setPasswordValidation('');
        else setPasswordValidation('Password not long enough');
        props.setPassword(password);
        props.setIsPasswordValid(isPasswordValid);
    }

    const setConfirmPasswordHandler = (e) => {
        let isPasswordValid = false;
        let confirmPassword = e.target.value;
        if (confirmPassword !== '' && confirmPassword !== props.password) {
            setConfirmPasswordValidation("Passwords don't match");
        } else {
            setConfirmPasswordValidation("");
        }
        if (props.password === confirmPassword && confirmPassword.length >= 8)
            isPasswordValid = true;
        props.setIsPasswordValid(isPasswordValid);
        setConfirmPassword(confirmPassword);
    }

    if (props.currentStep !== SetPassword) {
        return null;
    }

    return (
        <div>
            <h3>Create Password</h3>
            New password (8 characters min)
            <br />
            <input type="password" value={props.password} onChange={setPasswordHandler}></input>
            <br />
            <div>{passwordValidation}</div>
            Confirm password
            <br />
            <input type="password" value={confirmPassword} onChange={setConfirmPasswordHandler}></input>
            <div>{confirmPasswordValidation}</div>
        </div>
    );
}

const EnteringNumberStep = (props) => {


    if (props.currentStep !== EnteringNumber) {
        return null;
    }

    return (
        <div>
            <div className="zl_login_heading_text">
                <h3 className="zl_login_heading">Input the Number</h3>
                <p className="zl_login_peregraph">
                    Input the number you append what numbers of secret phrase in each slot.
                </p>
            </div>
            <div className="zl_login_row row">
                {props.numberArray.map((inputValue, i) => (
                    <div className="zl_login_col_3 col-lg-3 col-md-6" key={i}>
                        <div className="zl_login_input_content position-relative">
                            <p className="zl_login_input_text">{i + 1}</p>
                            <input
                                type="number"
                                className="zl_login_input"
                                name={`input${i + 1}`}
                                value={inputValue}
                                onChange={(e) => props.enteredNumberChange(e, i)}
                                placeholder="________"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const EnteringWordStep = (props) => {
    if (props.currentStep !== EnteringWord) {
        return null;
    }

    const customStyles = {
        // menu: (provided, state) => ({
        //     ...provided,
        //     width: state.selectProps.width,
        //     borderBottom: '1px dotted pink',
        //     color: state.selectProps.menuColor,
        //     padding: 20,
        // }),

        // control: (_, { selectProps: { width } }) => ({
        //     width: width
        // }),

        // singleValue: (provided, state) => {
        //     const opacity = state.isDisabled ? 0.5 : 1;
        //     const transition = 'opacity 300ms';

        //     return { ...provided, opacity, transition };
        // }
    }

    return (
        <div>
            <div className="zl_login_heading_text">
                <h3 className="zl_login_heading">Input the Words</h3>
                <p className="zl_login_peregraph">
                    Input the secret phrases you want in each slot.
                </p>
            </div>
            <div className="zl_login_row row">
                {Array(12)
                    .fill("input")
                    .map((inputValue, i) => (
                        <div className="zl_login_col_12 col-lg-12 col-md-24" key={i}>

                            <div className="zl_login_input_content position-relative">
                                <p className="zl_login_input_text">{i + 1}</p>
                                <Select styles={customStyles} isMulti={true} placeholder={''} options={props.options} onChange={(e) => props.enteredValueChange(e, i)} value={props.valueArray[i]} onInputChange={(e) => props.inputChange(e, i, [...props.valueArray])} inputValue={props.inputValueArray[i]} />
                                {/* <p className="zl_login_input_text">{i + 1}</p>
                                
                                <input
                                    type="text"
                                    className="zl_login_input"
                                    name={`input${i + 1}`}
                                    placeholder="________"
                                /> */}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

const ChecksumValidatingStep = (props) => {
    if (props.currentStep !== ChecksumValidating) {
        return null;
    }

    const checkedChanged = (i) => {
        props.setWalletChecked(props.walletChecked.map((c, ind) => (ind === i ? (!c) : c)));
    }

    return (
        <div>
            <div className="zl_login_heading_text">
                <h3 className="zl_login_heading">Checksum Validated</h3>
                <p className="zl_login_peregraph">
                    You can see some validated secret phrases in here.
                </p>
            </div>
            {props.mnemonics.map((mnemonic, i) => (
                <div key={i}>
                    <div className="zl_login_input_content position-relative">
                        <div className="zl_login_col_12 col-lg-12 col-md-24">
                            <div className="row justify-content-between">
                                <div className="col-11">
                                    {mnemonic.split(' ').map((word, wordIndex) => <label key={wordIndex} style={{ border: 'solid 1px gray', color: 'black', marginRight: '10px', padding: '10px' }}>{word}</label>)}
                                </div>
                                <div className="col-1">
                                    <input type="checkbox" checked={props.walletChecked[i]} onChange={() => checkedChanged(i)} />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            ))}
            {/* <div className="zl_login_row row">
                {props.mnemonics.map((mnemonic, i) => (
                    <div className="zl_login_input_content position-relative">
                        <div className="zl_login_col_12 col-lg-12 col-md-24" key={i}>
                            {mnemonic} <input type="checkbox" />
                        </div>
                    </div>
                ))}
            </div> */}
        </div>
    );
}

export default CreateWallet;
