export function Button(props) {
    // function handleClick(){
    //     console.log('clicked')
    // };

    return (
        <button 
            id={props.id} 
            className={props.id}
            onClick={props.onClick}
        >
            {props.text}
        </button>
    )
}