function Template(canvasTemplate){
    this.template = canvasTemplate;
    this.rows = canvasTemplate.split('\n');
    this.canvasWidth = this.rows[0].split(',').length;
    this.canvasHeight = this.rows.length;
}

