// DrainMaster Educational Game - Game Logic
class DrainMasterGame {
    constructor() {
        this.board = document.getElementById('game-board');
        this.toolsPanel = document.querySelector('.tools-panel');
        this.gameStats = {
            efficiency: 0,
            sustainability: 0,
            cost: 0
        };
        this.placedItems = [];
        this.selectedTool = null;
        this.gameActive = false;

        // Tool definitions with their properties
        this.tools = {
            basin: {
                name: 'Piscinão/Reservatório',
                image: 'Reservatório_02.jpg',
                efficiency: 25,
                sustainability: 20,
                cost: 15000,
                description: 'Armazena água da chuva para uso gradual'
            },
            garden: {
                name: 'Jardim de Chuva',
                image: 'jardins-de-chuva-1024x683.webp',
                efficiency: 20,
                sustainability: 30,
                cost: 8000,
                description: 'Plantas que absorvem e filtram água da chuva'
            },
            desilting: {
                name: 'Desassoreamento',
                image: 'desassoreamento-das-margens-do-Rio-Santo-Antonio-1.jpg',
                efficiency: 30,
                sustainability: 10,
                cost: 12000,
                description: 'Remove sedimentos que bloqueiam o fluxo d\'água'
            },
            permeable: {
                name: 'Pavimento Permeável',
                image: 'hero.png',
                efficiency: 15,
                sustainability: 25,
                cost: 10000,
                description: 'Permite que a água infiltre no solo'
            }
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createGameBoard();
        this.updateStatsDisplay();
        this.showInstructions();
    }

    setupEventListeners() {
        // Tool selection
        this.toolsPanel.addEventListener('click', (e) => {
            const toolItem = e.target.closest('.tool-item');
            if (toolItem) {
                this.selectTool(toolItem.dataset.tool);
            }
        });

        // Game board click to place items
        this.board.addEventListener('click', (e) => {
            if (this.selectedTool && this.gameActive) {
                this.placeItem(e);
            }
        });

        // Reset button
        document.getElementById('reset-game').addEventListener('click', () => {
            this.resetGame();
        });

        // Check solution button
        document.getElementById('check-solution').addEventListener('click', () => {
            this.checkSolution();
        });

        // Play again button
        document.getElementById('play-again').addEventListener('click', () => {
            this.resetGame();
        });
    }

    createGameBoard() {
        // Create a grid-based game board
        this.board.innerHTML = '';

        // Add some visual elements to represent the urban area
        const waterSource = document.createElement('div');
        waterSource.className = 'water-source';
        waterSource.innerHTML = '<img src="Reservatório_02.jpg" alt="Fonte d\'Água" class="map-icon">';
        waterSource.style.position = 'absolute';
        waterSource.style.top = '10%';
        waterSource.style.left = '10%';
        waterSource.style.width = '40px';
        waterSource.style.height = '40px';
        waterSource.style.background = 'rgba(59, 130, 246, 0.2)';
        waterSource.style.padding = '10px';
        waterSource.style.borderRadius = '10px';
        waterSource.style.fontWeight = 'bold';
        this.board.appendChild(waterSource);

        const drainOutlet = document.createElement('div');
        drainOutlet.className = 'drain-outlet';
        drainOutlet.innerHTML = '<img src="hero.png" alt="Escoamento" class="map-icon">';
        drainOutlet.style.position = 'absolute';
        drainOutlet.style.bottom = '10%';
        drainOutlet.style.right = '10%';
        drainOutlet.style.width = '40px';
        drainOutlet.style.height = '40px';
        drainOutlet.style.background = 'rgba(249, 115, 22, 0.2)';
        drainOutlet.style.padding = '10px';
        drainOutlet.style.borderRadius = '10px';
        drainOutlet.style.fontWeight = 'bold';
        this.board.appendChild(drainOutlet);

        // Add some buildings/obstacles
        for (let i = 0; i < 3; i++) {
            const building = document.createElement('div');
            building.className = 'building';
            building.innerHTML = '<img src="desassoreamento-das-margens-do-Rio-Santo-Antonio-1.jpg" alt="Edifício" class="map-icon">';
            building.style.position = 'absolute';
            building.style.top = `${20 + i * 20}%`;
            building.style.left = `${30 + i * 15}%`;
            building.style.width = '40px';
            building.style.height = '40px';
            building.style.background = 'rgba(100, 116, 139, 0.2)';
            building.style.padding = '15px';
            building.style.borderRadius = '8px';
            this.board.appendChild(building);
        }
    }

    selectTool(toolKey) {
        // Deselect all tools
        document.querySelectorAll('.tool-item').forEach(item => {
            item.classList.remove('active');
        });

        // Select the clicked tool
        const selectedItem = document.querySelector(`.tool-item[data-tool="${toolKey}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
            this.selectedTool = toolKey;
        }
    }

    placeItem(e) {
        if (!this.selectedTool) return;

        const rect = this.board.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Create the item element
        const item = document.createElement('div');
        item.className = 'game-item';
        item.dataset.tool = this.selectedTool;
        item.innerHTML = `<img src="${this.tools[this.selectedTool].image}" alt="${this.tools[this.selectedTool].name}" class="game-item-image">`;

        // Position the item
        item.style.position = 'absolute';
        item.style.left = `${x - 25}px`; // Center the item
        item.style.top = `${y - 25}px`;
        item.style.width = '50px';
        item.style.height = '50px';
        item.style.borderRadius = '50%';
        item.style.background = 'rgba(255, 255, 255, 0.8)';
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'center';
        item.style.fontSize = '1.5rem';
        item.style.border = `2px solid ${this.getToolColor(this.selectedTool)}`;
        item.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        item.style.cursor = 'pointer';
        item.style.transition = 'all 0.2s ease';
        item.style.zIndex = '10';

        // Add hover effect
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.1)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1)';
        });

        // Make it removable on right-click
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.removeItem(item);
        });

        this.board.appendChild(item);

        // Store item data
        this.placedItems.push({
            element: item,
            tool: this.selectedTool,
            x: x,
            y: y
        });

        // Update stats
        this.updateStats(this.selectedTool, true);
    }

    removeItem(item) {
        const index = this.placedItems.findIndex(i => i.element === item);
        if (index !== -1) {
            const removedItem = this.placedItems[index];
            this.placedItems.splice(index, 1);
            item.remove();

            // Update stats (remove the item's contribution)
            this.updateStats(removedItem.tool, false);
        }
    }

    updateStats(toolKey, isAdding) {
        const tool = this.tools[toolKey];
        const multiplier = isAdding ? 1 : -1;

        this.gameStats.efficiency += tool.efficiency * multiplier;
        this.gameStats.sustainability += tool.sustainability * multiplier;
        this.gameStats.cost += tool.cost * multiplier;

        // Ensure stats don't go below 0
        this.gameStats.efficiency = Math.max(0, this.gameStats.efficiency);
        this.gameStats.sustainability = Math.max(0, this.gameStats.sustainability);
        this.gameStats.cost = Math.max(0, this.gameStats.cost);

        this.updateStatsDisplay();
    }

    updateStatsDisplay() {
        document.getElementById('efficiency-score').textContent = `${Math.min(100, this.gameStats.efficiency)}%`;
        document.getElementById('sustainability-score').textContent = `${Math.min(100, this.gameStats.sustainability)}%`;
        document.getElementById('cost-score').textContent = `$${this.gameStats.cost.toLocaleString('pt-BR')}`;

        // Add color coding based on performance
        const efficiencyEl = document.getElementById('efficiency-score');
        const sustainabilityEl = document.getElementById('sustainability-score');

        if (this.gameStats.efficiency >= 80) {
            efficiencyEl.style.color = '#10b981'; // green
        } else if (this.gameStats.efficiency >= 50) {
            efficiencyEl.style.color = '#f59e0b'; // yellow
        } else {
            efficiencyEl.style.color = '#ef4444'; // red
        }

        if (this.gameStats.sustainability >= 80) {
            sustainabilityEl.style.color = '#10b981'; // green
        } else if (this.gameStats.sustainability >= 50) {
            sustainabilityEl.style.color = '#f59e0b'; // yellow
        } else {
            sustainabilityEl.style.color = '#ef4444'; // red
        }
    }

    getToolColor(toolKey) {
        const colors = {
            basin: '#3b82f6', // blue
            garden: '#10b981', // green
            desilting: '#f97316', // orange
            permeable: '#8b5cf6' // purple
        };
        return colors[toolKey] || '#64748b';
    }

    checkSolution() {
        if (this.placedItems.length === 0) {
            alert('Por favor, coloque algumas soluções de drenagem antes de verificar!');
            return;
        }

        this.gameActive = false;

        // Calculate final scores with some randomness for educational variety
        const baseEfficiency = Math.min(100, this.gameStats.efficiency);
        const baseSustainability = Math.min(100, this.gameStats.sustainability);

        // Add some variability based on placement strategy
        const placementBonus = this.calculatePlacementBonus();
        const finalEfficiency = Math.min(100, baseEfficiency + placementBonus.efficiency);
        const finalSustainability = Math.min(100, baseSustainability + placementBonus.sustainability);

        // Generate results
        const results = this.generateResults(finalEfficiency, finalSustainability);
        this.displayResults(results);
    }

    calculatePlacementBonus() {
        // Simple algorithm to reward good placement strategies
        let efficiencyBonus = 0;
        let sustainabilityBonus = 0;

        // Check if user placed items near water source or drain
        const waterSourceArea = { x: 10, y: 10, width: 20, height: 20 }; // percentage
        const drainArea = { x: 70, y: 70, width: 20, height: 20 }; // percentage

        let itemsNearWater = 0;
        let itemsNearDrain = 0;

        this.placedItems.forEach(item => {
            const itemX = (item.x / this.board.clientWidth) * 100;
            const itemY = (item.y / this.board.clientHeight) * 100;

            // Check proximity to water source
            if (itemX >= waterSourceArea.x && itemX <= waterSourceArea.x + waterSourceArea.width &&
                itemY >= waterSourceArea.y && itemY <= waterSourceArea.y + waterSourceArea.height) {
                itemsNearWater++;
            }

            // Check proximity to drain
            if (itemX >= drainArea.x && itemX <= drainArea.x + drainArea.width &&
                itemY >= drainArea.y && itemY <= drainArea.y + drainArea.height) {
                itemsNearDrain++;
            }
        });

        // Bonus for strategic placement
        if (itemsNearWater > 0) {
            efficiencyBonus += 10;
            sustainabilityBonus += 5;
        }

        if (itemsNearDrain > 0) {
            efficiencyBonus += 15;
            sustainabilityBonus += 10;
        }

        # Bonus for diversity of tools
        const toolTypes = new Set(this.placedItems.map(item => item.tool));
        if (toolTypes.size >= 3) {
            efficiencyBonus += 10;
            sustainabilityBonus += 15;
        }

        return { efficiency: efficiencyBonus, sustainability: sustainabilityBonus };
    }

    generateResults(efficiency, sustainability) {
        let performance = '';
        let message = '';
        let recommendations = [];

        if (efficiency >= 80 && sustainability >= 80) {
            performance = 'Excelente';
            message = 'Parabéns! Você projetou um sistema de drenagem altamente eficiente e sustentável.';
            recommendations = [
                'Seu sistema equilibra bem capacidade de armazenamento e absorção natural.',
                'Considere compartilhar esse conhecimento com sua comunidade.',
                'Você está pronto para enfrentar desafios de drenagem do mundo real!'
            ];
        } else if (efficiency >= 60 && sustainability >= 60) {
            performance = 'Bom';
            message = 'Bom trabalho! Seu sistema mostra bom entendimento dos princípios de drenagem.';
            recommendations = [
                'Você está no caminho certo! Tente equilibrar mais entre soluções estruturais e naturais.',
                'Considere adicionar mais jardins de chuva para melhorar a sustentabilidade.',
                'Piscinões são ótimos para controlar picos de vazão durante tempestades fortes.'
            ];
        } else if (efficiency >= 40 || sustainability >= 40) {
            performance = 'Regular';
            message = 'Você entende alguns conceitos, mas pode melhorar seu projeto.';
            recommendations = [
                'Tente combinar diferentes tipos de soluções para melhores resultados.',
                'Lembre-se que tanto soluções de engenharia quanto naturais são importantes.',
                'Observe como a água flui na sua vizinhança e onde os pontos de acumulação ocorrem.'
            ];
        } else {
            performance = 'Precisa Melhorar';
            message = 'Continue aprendendo! Vamos tentar novamente com foco em diferentes abordagens.';
            recommendations = [
                'Estude mais sobre cada tipo de solução de drenagem disponível.',
                'Piscinões ajudam a controlar enchentes temporárias.',
                'Jardins de chuva filtram poluentes e recarregam aquíferos.',
                'Desassoreamento restaura a capacidade natural dos canais de drenagem.',
                'Pavimentos permeáveis reduzem o escoamento superficial.'
            ];
        }

        return {
            performance,
            message,
            efficiency,
            sustainability,
            cost: this.gameStats.cost,
            recommendations,
            itemsPlaced: this.placedItems.length
        };
    }

    displayResults(results) {
        const resultsContent = document.getElementById('results-content');
        resultsContent.innerHTML = `
            <div class="result-item">
                <span>Desempenho:</span>
                <span class="result-value">${results.performance}</span>
            </div>
            <div class="result-item">
                <span>Eficiência:</span>
                <span class="result-value">${results.efficiency.toFixed(0)}%</span>
            </div>
            <div class="result-item">
                <span>Sustentabilidade:</span>
                <span class="result-value">${results.sustainability.toFixed(0)}%</span>
            </div>
            <div class="result-item">
                <span>Investimento:</span>
                <span class="result-value">$${results.cost.toLocaleString('pt-BR')}</span>
            </div>
            <div class="result-item">
                <span>Itens colocados:</span>
                <span class="result-value">${results.itemsPlaced}</span>
            </div>
        `;

        const recommendationsDiv = document.createElement('div');
        recommendationsDiv.className = 'recommendations';
        recommendationsDiv.innerHTML = `
            <h3>Recomendações:</h3>
            <ul>
                ${results.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        `;

        resultsContent.appendChild(recommendationsDiv);

        // Show results panel
        document.getElementById('game-play').style.display = 'none';
        document.getElementById('game-results').style.display = 'block';
    }

    resetGame() {
        // Clear the board
        this.placedItems = [];
        this.board.innerHTML = '';

        // Reset stats
        this.gameStats = { efficiency: 0, sustainability: 0, cost: 0 };

        // Reset UI
        document.querySelectorAll('.tool-item').forEach(item => {
            item.classList.remove('active');
        });

        this.selectedTool = null;
        this.gameActive = true;
        this.updateStatsDisplay();

        // Hide results, show game
        document.getElementById('game-results').style.display = 'none';
        document.getElementById('game-play').style.display = 'flex';

        // Recreate board
        this.createGameBoard();

        // Show instructions again
        this.showInstructions();
    }

    showInstructions() {
        // Create a temporary overlay with instructions
        const overlay = document.createElement('div');
        overlay.className = 'instructions-overlay';
        overlay.innerHTML = `
            <div class="instructions-content">
                <h2>Como Jogar</h2>
                <ol>
                    <li>Selecione uma ferramenta de drenagem no painel lateral</li>
                    <li>Clique no tabuleiro para colocar a solução escolhida</li>
                    <li>Clique com o botão direito para remover uma solução colocada</li>
                    <li>Quando estiver satisfeito com seu projeto, clique em "Verificar Solução"</li>
                    <li>Veja seus resultados e receba recomendações para melhorar</li>
                </ol>
                <p><strong>Dica:</strong> Combine diferentes tipos de soluções para melhores resultados!</p>
                <button id="start-game" class="btn-start">Começar a Jogar</button>
            </div>
        `;

        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0, 0, 0, 0.8)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '1000';
        overlay.style.color = 'white';
        overlay.style.textAlign = 'center';
        overlay.style.padding = '2rem';

        overlay.querySelector('.instructions-content')?.style.background = 'rgba(0, 0, 0, 0.6)';
        overlay.querySelector('.instructions-content')?.style.padding = '2rem';
        overlay.querySelector('.instructions-content')?.style.borderRadius = '20px';
        overlay.querySelector('.instructions-content')?.style.maxWidth = '500px';

        document.body.appendChild(overlay);

        document.getElementById('start-game').addEventListener('click', () => {
            overlay.remove();
        });

        // Style the start button
        const startBtn = document.getElementById('start-game');
        startBtn.style.background = '#3b82f6';
        startBtn.style.color = 'white';
        startBtn.style.border = 'none';
        startBtn.style.padding = '1rem 2rem';
        startBtn.style.borderRadius = '12px';
        startBtn.style.fontFamily = "'Outfit', sans-serif";
        startBtn.style.fontWeight = '600';
        startBtn.style.fontSize = '1.1rem';
        startBtn.style.cursor = 'pointer';
        startBtn.style.transition = 'all 0.3s ease';

        startBtn.addEventListener('mouseenter', () => {
            startBtn.style.background = '#2563eb';
            startBtn.style.transform = 'translateY(-2px)';
        });

        startBtn.addEventListener('mouseleave', () => {
            startBtn.style.background = '#3b82f6';
            startBtn.style.transform = 'translateY(0)';
        });
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.drainMasterGame = new DrainMasterGame();
});