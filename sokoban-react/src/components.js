import { useState } from "react";
import ReactDOM from 'react-dom';


export function Button({text, id, onclick, className, isDisabled}){
    return (
        <button 
            id={id} 
            className={className}
            onClick={onclick}
            disabled={isDisabled}

        >
            {text}
        </button>
    )
}

export function Popup({header, message, buttonLeftText, buttonRightText, function1, function2, onClose}){
    // Rendered as a react portal to avoid alignment issues with parent container
    return ReactDOM.createPortal(
        <div className="overlay" id="popupContainer">
            <div className="divPopup" id="popupBox">
                <button className="buttonClose topRight" onClick={onClose}>
                &times;
                </button>

                <div className="popupHeaderDiv">{header}</div>

                <div className="divPopupMessage">{message}</div>

                <div className="divPopupButtonContainer">
                    <Button text={buttonLeftText} id={buttonLeftText} onclick={function1} />
                
                    <Button text={buttonRightText} id={buttonRightText} onclick={function2} />
                </div>
            </div>
        </div>,
    document.body 
    )
}

export function LevelSelector({options, selectLevel, currentLevel}){
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    }

    return(
        <div>
            <Button text={"Select Level"} id={"levelSelect"} onclick={toggleDropdown}/>
            <div className="dropdownContent">
                {isDropdownOpen && 
                    options.map((option) => 
                        currentLevel.levelName===option.levelName ? (
                            // if current level is selected, disable button
                            <Button text={option.levelName} id={option.levelName} onclick={() => selectLevel(option)} className="marginTop" isDisabled={true}/>
                        ) : (
                            <Button text={option.levelName} id={option.levelName} onclick={() => selectLevel(option)} className="marginTop" isDisabled={false}/> 
                        )
                    )
                }
            </div>
        </div>
    )
}