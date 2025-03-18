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


export function Wall(context, x, y, color, size, image){
    this.x=x;
    this.y=y;  
    this.color=color;
    this.size=size;
    this.ctx = context;
    this.drawWallBlock = function (){
        let ctx = this.ctx
        if (image != null) {
            this.image = new Image();
            this.image.src = image;
            ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
        }else{
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }
}

export function Player(context, x, y, color, size, image){
    this.x=x;
    this.y=y;
    this.speedX = size;
    this.speedY = size;   
    this.color=color;
    if (image != null) {
        this.image = new Image();
        this.image.src = image;
    }
    this.size=size;
    this.ctx = context

    this.update = function(){
        let ctx = this.ctx
        if (image != null) {
            ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
        }else{
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.size, this.size);    
        }
    }
}