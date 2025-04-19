import { useState } from "react"

export function Button({text, id, onclick}){
    return (
        <button 
            id={id} 
            className={id}
            onClick={onclick}
        >
            {text}
        </button>
    )
}

export function Popup({header, message, buttonLeftText, buttonRightText, function1, function2, onClose}){
    return(
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
        </div>
    )
}

export function LevelSelector({options, selectLevel}){
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);


    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    }

    return(
        <div>
            <Button text={"Select Level"} id={"levelSelect"} onclick={toggleDropdown}/>
            {isDropdownOpen && 
                options.map((option) => (
                    <Button text={option.levelName} id={option.levelName} onclick={() => selectLevel(option)}/>
                ))
            }
        </div>
    )
}