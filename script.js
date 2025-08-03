class AIHistory {
    constructor() {
        this.svg = document.getElementById('network');
        this.nodes = new Map();
        this.edges = new Map();
        this.currentSection = 0;
        this.sections = [];
        
        this.init();
    }
    
    init() {
        this.setupScrollObserver();
        this.setupNetwork();
        this.defineSections();
    }
    
    setupScrollObserver() {
        const sections = document.querySelectorAll('section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionIndex = Array.from(sections).indexOf(entry.target);
                    this.activateSection(sectionIndex);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-20% 0px -20% 0px'
        });
        
        sections.forEach(section => observer.observe(section));
    }
    
    setupNetwork() {
        const rect = this.svg.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
    }
    
    defineSections() {
        this.sections = [
            { name: 'intro', action: () => this.showIntro() },
            { name: 'first-warning', action: () => this.showFirstWarning() },
            { name: 'robot-laws', action: () => this.showRobotLaws() },
            { name: 'intelligence-explosion', action: () => this.showIntelligenceExplosion() },
            // We'll add more sections
        ];
    }
    
    activateSection(index) {
        if (index >= 0 && index < this.sections.length) {
            this.currentSection = index;
            this.sections[index].action();
        }
    }
    
    // Network manipulation methods
    addNode(id, x, y, label, color = '#4a90e2', size = 20) {
        const node = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        node.setAttribute('class', 'network-node');
        node.setAttribute('transform', `translate(${x}, ${y})`);
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', size);
        circle.setAttribute('fill', color);
        circle.setAttribute('opacity', '0');
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dy', '0.35em');
        text.setAttribute('font-size', '14');
        text.setAttribute('fill', '#fff');
        text.setAttribute('opacity', '0');
        text.textContent = label;
        
        node.appendChild(circle);
        node.appendChild(text);
        this.svg.appendChild(node);
        
        this.nodes.set(id, { element: node, circle, text, x, y, size, color });
        
        // Animate in
        setTimeout(() => {
            circle.setAttribute('opacity', '0.9');
            text.setAttribute('opacity', '1');
        }, 100);
        
        return node;
    }
    
    addEdge(fromId, toId, strength = 1) {
        const fromNode = this.nodes.get(fromId);
        const toNode = this.nodes.get(toId);
        
        if (!fromNode || !toNode) return;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('class', 'network-edge');
        line.setAttribute('x1', fromNode.x);
        line.setAttribute('y1', fromNode.y);
        line.setAttribute('x2', toNode.x);
        line.setAttribute('y2', toNode.y);
        line.setAttribute('stroke', '#666');
        line.setAttribute('stroke-width', strength * 3);
        line.setAttribute('opacity', '0');
        
        this.svg.insertBefore(line, this.svg.firstChild);
        this.edges.set(`${fromId}-${toId}`, line);
        
        // Animate in
        setTimeout(() => {
            line.setAttribute('opacity', '0.6');
        }, 200);
    }
    
    // Section animations
    showIntro() {
        // Clear everything for intro
    }
    
    showFirstWarning() {
        this.addNode('capabilities', this.centerX, this.centerY, 'AI Capabilities', '#e74c3c', 15);
        this.showAnnotation(
            this.centerX + 100, 
            this.centerY - 100,
            '"At some stage therefore we should have to expect the machines to take control." - Alan Turing, 1951',
            'In 1951, before computers could even multiply reliably, Turing saw the endgame.'
        );
    }
    
    showRobotLaws() {
        this.addNode('alignment', this.centerX - 150, this.centerY + 100, 'Alignment', '#27ae60', 12);
        this.showAnnotation(
            this.centerX - 300,
            this.centerY + 50,
            'Asimov\'s Three Laws: The first systematic attempt at AI safety.',
            'But they fail. What happens when laws conflict? Who decides what "harm" means?'
        );
    }
    
    showIntelligenceExplosion() {
        this.addNode('risk', this.centerX + 150, this.centerY - 50, 'Risk Assessment', '#f39c12', 18);
        this.addEdge('capabilities', 'risk');
        this.showAnnotation(
            this.centerX + 200,
            this.centerY - 150,
            '"The first ultraintelligent machine is the last invention that man need ever make" - I.J. Good, 1965',
            'This wasn\'t science fiction. It was a mathematical theorem about recursive optimization.'
        );
    }
    
    showAnnotation(x, y, quote, explanation) {
        const annotation = document.createElement('div');
        annotation.className = 'annotation';
        annotation.style.left = x + 'px';
        annotation.style.top = y + 'px';
        
        annotation.innerHTML = `
            <div class="quote">${quote}</div>
            <p>${explanation}</p>
        `;
        
        document.body.appendChild(annotation);
        
        setTimeout(() => {
            annotation.classList.add('visible');
        }, 300);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIHistory();
});