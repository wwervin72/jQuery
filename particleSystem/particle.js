;(function (window) {
    function Particle (dom) {
        this.dom = dom;
        this.nodes = [];
        this.lines = [];
        this.mousePos = [0, 0];
        let defaultSetting = {
            width: document.body.clientWidth,
            height: document.body.clientHeight,
            backgroundColor: '#000',
            easingFactor: 3,
            nodeCount: 100,
            nodeColor: '#aaa',
            lineColor: '#fff',
        };
        this.option = _extend(defaultSetting, this.getCustomSetting());
        // 生成canvas
        this.ctx = this.createCanvas();
        this.createNodes();
        (function (particle) {
            window.onmousemove = function (event) {
                particle.mousePos[0] = event.clientX;
                particle.mousePos[1] = event.clientY;
            };
            window.onresize = function () {
                particle.canvas.width = particle.canvas.clientWidth;
                particle.canvas.height = particle.canvas.clientHeight;
                if(particle.nodes.length == 0) {
                    particle.createNodes();
                }
                particle.render();
            };
        }(this));  
        window.requestAnimationFrame(this.step.bind(this));
        return this;
    }

    Particle.prototype = {
        contructor: Particle,
        getCustomSetting: function () {
            return JSON.parse(this.dom.getAttribute('particle-set')) || {};
        },
        createCanvas: function () {
            let canvas = document.createElement('canvas'),
                ctx;

            canvas.width = this.option.width;
            canvas.height = this.option.height;
            this.canvas = canvas;
            this.dom.appendChild(canvas);

            ctx = canvas.getContext('2d');
            // 添加背景色
            ctx.fillStyle = this.option.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            return ctx;
        },
        createNodes: function () {
            for(let i = 0; i < this.option.nodeCount; i++){
                this.nodes.push({
                    drivenByMouse: i == 0,
                    x: Math.random() * this.option.width,
                    y: Math.random() * this.option.height,
                    vx: Math.random() * 1 - 0.5,
                    vy: Math.random() * 1 - 0.5,
                    radius: Math.random() > 0.9 ? 2 + Math.random() * 2 : 1 + Math.random() * 2
                });
            }
            let len = this.nodes.length;
            for(let n = 0; n < len; n++){
                for(let m = n; m < len; m++){
                    this.lines.push({from: this.nodes[n], to: this.nodes[m]});
                }
            }
        },
        step: function () {
            let w = this.option.width,
                h = this.option.height;
            this.nodes.forEach(function (item) {
                if(item.drivenByMouse){
                    return;
                }
                item.x += item.vx;
                item.y += item.vy;
                if(item.x <= 0 || item.x >= w){
                    item.vx *= -1;
                    item.x = clamp(0, w, item.x);
                }
                if(item.y <= 0 || item.y >= h){
                    item.vy *= -1;
                    item.y = clamp(0, h, item.y);
                }
            });
            this.adjustNodeDrivenByMouse();
            this.render();
            window.requestAnimationFrame(this.step.bind(this));
        },
        adjustNodeDrivenByMouse: function () {
            this.nodes[0].x += (this.mousePos[0] - this.nodes[0].x) / this.option.easingFactor;
            this.nodes[0].y += (this.mousePos[1] - this.nodes[0].y) / this.option.easingFactor;
        },
        lengthOfEdge: function (line) {
            return Math.sqrt(Math.pow((line.from.x - line.to.x), 2) + Math.pow((line.from.y - line.to.y), 2));
        },
        render: function () {
            let ctx = this.ctx,
                _this = this;
            ctx.fillStyle = _this.option.backgroundColor;
            ctx.fillRect(0, 0, _this.option.width, _this.option.height);
            _this.lines.forEach(function (item) {
                let l = _this.lengthOfEdge(item),
                    threshold = _this.canvas.width / 8;
                if(l > threshold){
                    return;
                } 
                ctx.strokeStyle = _this.option.lineColor;
                ctx.lineWidth = (1 - l / threshold) * 2.5;
                ctx.globalAlpha = 1 - l / threshold;
                ctx.beginPath();
                ctx.moveTo(item.from.x, item.from.y);
                ctx.lineTo(item.to.x, item.to.y);
                ctx.stroke();
            });
            _this.nodes.forEach(function (ele) {
                if(ele.drivenByMouse) {
                    return;
                }

                ctx.fillStyle = _this.option.nodeColor;
                ctx.beginPath();
                ctx.arc(ele.x, ele.y, ele.radius, 0, 2 * Math.PI);
                ctx.fill();
            });
        }
    };

    function _extend () {
        let result = {},
            isDepthExtend = true,
            prop;
        if(!arguments.length){
            return result;
        }

        Array.prototype.forEach.call(arguments, function _self(item, index) {
            // 是否深度遍历
            if(!index && _getType(item) === 'Boolean' && item){
                isDepthExtend = true;
            }
            for(prop in item){
                if(item.hasOwnProperty(prop)){
                    if(_getType(item[prop]) === 'object' && isDepthExtend){
                        _self(item);
                    }else{
                        result[prop] = item[prop];
                    }
                }
            }
        });
        return result;
    }

    function _getType (o) {
        return Object.prototype.toString.call(o).slice(8, -1);
    }

    function clamp (min, max, value) {
        if(min > value){
            return min;
        }
        if(max < value){
            return max;
        }
        return value;
    }
    window.Particle = Particle;
}(this))