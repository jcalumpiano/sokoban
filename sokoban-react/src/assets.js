// export function Button(props) {
//     // function handleClick(){
//     //     console.log('clicked')
//     // };

//     return (
//         <button 
//             id={props.id} 
//             className={props.id}
//             onClick={props.onClick}
//         >
//             {props.text}
//         </button>
//     )
// }


export function Wall(context, x, y, color, size, image){
    this.x=x;
    this.y=y;  
    this.color=color;
    this.size=size;
    this.ctx = context;
    

    this.drawWallBlock = function (){
        let ctx = this.ctx
        if (image != null) {
            ctx.drawImage(image, this.x, this.y, this.size, this.size);
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
    this.color = null ? "lightgray" : color;
    if (image != null) {
        this.image = new Image();
        this.image.src = image;
    }
    this.size=size;
    this.ctx = context
    

    this.update = function(){
        let ctx = this.ctx
        if (image != null) {
            ctx.drawImage(image, this.x, this.y, this.size, this.size);
        }else{
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.size, this.size);    
        }
    }
}

export function MoveableBox(context, x, y, color, size, markedColor, image, markedImage){
    this.x=x;
    this.y=y;
    this.speedX = size;
    this.speedY = size;   
    this.color=color;
    this.size=size;
    this.id = Date.now()*(Math.floor(Math.random() * 100))
    this.ctx = context
    if (image != null) {
        this.image = new Image();
        this.image.src = image;
    }
    if (markedImage != null) {
        this.markedImage = new Image();
        this.markedImage.src = markedImage;
    }
    this.update = function(){
        if (image != null) {
            this.ctx.drawImage(image, this.x, this.y, this.size, this.size);
        }else{
            this.ctx.fillStyle = color;
            this.ctx.fillRect(this.x, this.y, this.size, this.size);    
        }
    };
    this.markBox = function(){
        if (markedImage != null) {
            this.ctx.drawImage(markedImage, this.x, this.y, this.size, this.size);
        }else{
            this.ctx.fillStyle = markedColor;
            this.ctx.fillRect(this.x, this.y, this.size, this.size);    
        }
    }
}

export function Target(context, x, y, color, size, image){
    this.x=x;
    this.y=y;  
    this.color=color;
    this.size=size;
    this.ctx = context;
    this.drawTarget = function (){
        if (image != null) {
            this.image = new Image();
            this.image.src = image;
            this.ctx.drawImage(image, this.x, this.y, this.size, this.size);
        }else{
            this.ctx.fillStyle = color;
            this.ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }
}