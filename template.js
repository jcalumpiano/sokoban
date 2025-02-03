function Level(level){
    this.template = level.levelTemplate;
    this.rows = this.template.split('\n');
    this.canvasWidth = this.rows[0].split(',').length;
    this.canvasHeight = this.rows.length;
    this.levelName = level.levelName
}

