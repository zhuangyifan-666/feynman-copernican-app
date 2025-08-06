/**
 * Feynman Learning & Copernican Flip Application
 * 
 * This application helps users implement the Feynman Learning Method and Copernican Flip
 * to master complex concepts through teaching and perspective shifts.
 */

// Main application class
class FeynmanCopernicanApp {
    constructor() {
        this.topics = [];
        this.currentTopic = null;
        this.settings = {
            theme: 'light',
            fontSize: 16,
            notifications: {
                reminders: true,
                progress: true
            },
            apiKey: 'sk-d33a05a2643e4f79b822a18a4ee3cf39' // Deepseek API密钥
        };
        
        // Initialize the application
        this.init();
    }
    
    /**
     * Initialize the application
     */
    init() {
        // Load data from local storage
        this.loadData();
        
        // Set up navigation
        this.setupNavigation();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Apply settings
        this.applySettings();
        
        // Update UI
        this.updateUI();
    }
    
    /**
     * Set up navigation between views
     */
    setupNavigation() {
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Hide all views
                const views = document.querySelectorAll('.view');
                views.forEach(view => view.classList.remove('active'));
                
                // Show the selected view
                const viewId = link.getAttribute('data-view');
                document.getElementById(viewId).classList.add('active');
            });
        });
    }
    
    /**
     * Set up event listeners for various UI elements
     */
    setupEventListeners() {
        // New topic button
        const newTopicBtn = document.getElementById('new-topic-btn');
        if (newTopicBtn) {
            newTopicBtn.addEventListener('click', () => this.openNewTopicModal());
        }
        
        // Create topic button in Feynman workspace
        const createTopicBtn = document.getElementById('create-topic-btn');
        if (createTopicBtn) {
            createTopicBtn.addEventListener('click', () => this.openNewTopicModal());
        }
        
        // Tab buttons
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all tab buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Hide all tab content
                const tabContents = document.querySelectorAll('.tab-content');
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Show the selected tab content
                const tabId = btn.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // AI Chat controls
        const sendMessageBtn = document.getElementById('send-message-btn');
        if (sendMessageBtn) {
            sendMessageBtn.addEventListener('click', () => this.sendMessage());
        }
        
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        
        const saveChatBtn = document.getElementById('save-chat-btn');
        if (saveChatBtn) {
            saveChatBtn.addEventListener('click', () => this.saveChat());
        }
        
        const clearChatBtn = document.getElementById('clear-chat-btn');
        if (clearChatBtn) {
            clearChatBtn.addEventListener('click', () => this.clearChat());
        }
        
        const generateSummaryBtn = document.getElementById('generate-summary-btn');
        if (generateSummaryBtn) {
            generateSummaryBtn.addEventListener('click', () => this.generateSummary());
        }
        
        // 移除手动模式相关的事件监听器
        
        // Save insights button
        const saveInsightsBtn = document.getElementById('save-insights-btn');
        if (saveInsightsBtn) {
            saveInsightsBtn.addEventListener('click', () => this.saveInsights());
        }
        
        // Generate questions button
        const generateQuestionsBtn = document.getElementById('generate-questions-btn');
        if (generateQuestionsBtn) {
            generateQuestionsBtn.addEventListener('click', () => this.generateQuestions());
        }
        
        // Topic select dropdowns
        const topicSelect = document.getElementById('topic-select');
        if (topicSelect) {
            topicSelect.addEventListener('change', () => this.loadSelectedTopic(topicSelect.value));
        }
        
        const flipTopicSelect = document.getElementById('flip-topic-select');
        if (flipTopicSelect) {
            flipTopicSelect.addEventListener('change', () => this.loadSelectedTopic(flipTopicSelect.value));
        }
        
        // Settings controls
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.addEventListener('change', () => {
                this.settings.theme = themeSelect.value;
                this.applySettings();
                this.saveData();
            });
        }
        
        const fontSizeInput = document.getElementById('font-size');
        if (fontSizeInput) {
            fontSizeInput.addEventListener('input', () => {
                this.settings.fontSize = fontSizeInput.value;
                document.getElementById('font-size-value').textContent = `${fontSizeInput.value}px`;
                this.applySettings();
                this.saveData();
            });
        }
        
        const reminderNotifications = document.getElementById('reminder-notifications');
        if (reminderNotifications) {
            reminderNotifications.addEventListener('change', () => {
                this.settings.notifications.reminders = reminderNotifications.checked;
                this.saveData();
            });
        }
        
        const progressNotifications = document.getElementById('progress-notifications');
        if (progressNotifications) {
            progressNotifications.addEventListener('change', () => {
                this.settings.notifications.progress = progressNotifications.checked;
                this.saveData();
            });
        }
        
        // Data management buttons
        const exportDataBtn = document.getElementById('export-data-btn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => this.exportData());
        }
        
        const importDataBtn = document.getElementById('import-data-btn');
        if (importDataBtn) {
            importDataBtn.addEventListener('click', () => this.importData());
        }
        
        const clearDataBtn = document.getElementById('clear-data-btn');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => {
            if (confirm('您确定要清除所有数据吗？此操作无法撤消。')) {
                this.clearData();
            }
            });
        }
        
        // Modal controls
        const closeModalBtns = document.querySelectorAll('.close-modal, .cancel-modal');
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
        
        // New topic form submission
        const newTopicForm = document.getElementById('new-topic-form');
        if (newTopicForm) {
            newTopicForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createNewTopic();
            });
        }
        
        // Search library
        const searchLibrary = document.getElementById('search-library');
        if (searchLibrary) {
            searchLibrary.addEventListener('input', () => this.filterLibrary(searchLibrary.value));
        }
        
        // Sort library
        const sortLibrary = document.getElementById('sort-library');
        if (sortLibrary) {
            sortLibrary.addEventListener('change', () => this.sortLibrary(sortLibrary.value));
        }
    }
    
    /**
     * Open the new topic modal
     */
    openNewTopicModal() {
        const modal = document.getElementById('new-topic-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }
    
    /**
     * Close any open modal
     */
    closeModal() {
        const modal = document.getElementById('new-topic-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    /**
     * Create a new topic from the form data
     */
    createNewTopic() {
        const topicName = document.getElementById('topic-name').value;
        const topicCategory = document.getElementById('topic-category').value || 'Uncategorized';
        const topicDescription = document.getElementById('topic-description').value || '';
        
        if (!topicName) {
            alert('请输入主题名称');
            return;
        }
        
        const newTopic = {
            id: Date.now().toString(),
            name: topicName,
            category: topicCategory,
            description: topicDescription,
            dateCreated: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            feynman: {
                explanation: '',
                feedback: '',
                gaps: []
            },
            copernican: {
                originalPerspective: '',
                flippedPerspective: '',
                insights: '',
                questions: []
            }
        };
        
        this.topics.push(newTopic);
        this.currentTopic = newTopic;
        this.saveData();
        this.updateUI();
        this.closeModal();
        
        // Reset form
        document.getElementById('topic-name').value = '';
        document.getElementById('topic-category').value = '';
        document.getElementById('topic-description').value = '';
        
        // Navigate to Feynman method tab
        document.querySelector('nav a[data-view="feynman"]').click();
    }
    
    // 移除手动模式相关的方法
    
    /**
     * Save insights from the Copernican Flip
     */
    saveInsights() {
        if (!this.currentTopic) {
            alert('请先选择或创建一个主题');
            return;
        }
        
        const originalPerspective = document.getElementById('original-perspective').value;
        const flippedPerspective = document.getElementById('flipped-perspective').value;
        const insights = document.getElementById('insights-text').value;
        
        this.currentTopic.copernican.originalPerspective = originalPerspective;
        this.currentTopic.copernican.flippedPerspective = flippedPerspective;
        this.currentTopic.copernican.insights = insights;
        this.currentTopic.lastModified = new Date().toISOString();
        
        this.saveData();
        this.updateUI();
        
        // Show feedback
        this.showNotification('洞察已成功保存！');
    }
    
    /**
     * Generate thought-provoking questions based on the perspectives
     */
    generateQuestions() {
        if (!this.currentTopic) {
            alert('Please select or create a topic first');
            return;
        }
        
        const originalPerspective = document.getElementById('original-perspective').value;
        const flippedPerspective = document.getElementById('flipped-perspective').value;
        
        if (!originalPerspective || !flippedPerspective) {
            alert('请先填写两个视角字段');
            return;
        }
        
        // Generate questions based on the perspectives
        const questions = [
            `你会如何向从未听说过${this.currentTopic.name}的人解释这个概念？`,
            `你在原始视角中做出了哪些可能不正确的假设？`,
            `一个完全不同领域的专家可能如何看待这个概念？`,
            `如果你原始理解的反面是真的，会发生什么？`,
            `这个概念如何与你熟悉的其他领域联系起来？`
        ];
        
        // Update the questions list
        const questionsList = document.getElementById('questions-list');
        if (questionsList) {
            questionsList.innerHTML = questions.map(q => `<li>${q}</li>`).join('');
        }
        
        // Save the questions
        this.currentTopic.copernican.questions = questions;
        this.currentTopic.lastModified = new Date().toISOString();
        
        this.saveData();
    }
    
    /**
     * Load a selected topic
     * @param {string} topicId - The ID of the topic to load
     */
    loadSelectedTopic(topicId) {
        if (!topicId) return;
        
        const topic = this.topics.find(t => t.id === topicId);
        if (topic) {
            this.currentTopic = topic;
            
            // 更新AI聊天界面
            const chatMessages = document.getElementById('chat-messages');
            if (chatMessages) {
                if (topic.feynman.chat && topic.feynman.chat.length > 0) {
                    // 显示现有对话
                    let chatHtml = '';
                    topic.feynman.chat.forEach(msg => {
                        if (msg.role === 'user') {
                            chatHtml += `
                                <div class="message user-message">
                                    <div class="message-content">
                                        <p>${this.escapeHtml(msg.content)}</p>
                                    </div>
                                    <div class="message-avatar">你</div>
                                </div>
                            `;
                        } else {
                            chatHtml += `
                                <div class="message ai-message">
                                    <div class="message-avatar">AI</div>
                                    <div class="message-content">
                                        <p>${this.escapeHtml(msg.content)}</p>
                                    </div>
                                </div>
                            `;
                        }
                    });
                    chatMessages.innerHTML = chatHtml;
                } else {
                    // 显示欢迎消息
                    chatMessages.innerHTML = `
                        <div class="message ai-message">
                            <div class="message-avatar">AI</div>
                            <div class="message-content">
                                <p>你好！我是你的费曼学习助手。我们今天要学习的主题是"${topic.name}"。请尝试用简单的语言解释这个概念，就像你在教一个小学生一样。</p>
                            </div>
                        </div>
                    `;
                    
                    // 初始化聊天记录
                    if (!topic.feynman.chat) {
                        topic.feynman.chat = [];
                    }
                }
                
                // 滚动到底部
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
            
            // Update Copernican workspace
            const originalPerspective = document.getElementById('original-perspective');
            if (originalPerspective) {
                originalPerspective.value = topic.copernican.originalPerspective || '';
            }
            
            const flippedPerspective = document.getElementById('flipped-perspective');
            if (flippedPerspective) {
                flippedPerspective.value = topic.copernican.flippedPerspective || '';
            }
            
            const insightsText = document.getElementById('insights-text');
            if (insightsText) {
                insightsText.value = topic.copernican.insights || '';
            }
            
            const questionsList = document.getElementById('questions-list');
            if (questionsList) {
                if (topic.copernican.questions && topic.copernican.questions.length > 0) {
                    questionsList.innerHTML = topic.copernican.questions.map(q => `<li>${q}</li>`).join('');
                } else {
                    questionsList.innerHTML = '<li class="empty-state">生成后问题将显示在这里。</li>';
                }
            }
        }
    }
    
    /**
     * Filter the library based on search term
     * @param {string} searchTerm - The term to search for
     */
    filterLibrary(searchTerm) {
        const topicsContainer = document.querySelector('.topics-container');
        if (!topicsContainer) return;
        
        if (this.topics.length === 0) {
            topicsContainer.innerHTML = '<p class="empty-state">Your library is empty. Start by creating a new topic!</p>';
            return;
        }
        
        const filteredTopics = searchTerm 
            ? this.topics.filter(topic => 
                topic.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                topic.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                topic.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : this.topics;
        
        this.renderTopics(filteredTopics);
    }
    
    /**
     * Sort the library based on sort option
     * @param {string} sortOption - The option to sort by
     */
    sortLibrary(sortOption) {
        const topicsContainer = document.querySelector('.topics-container');
        if (!topicsContainer) return;
        
        if (this.topics.length === 0) {
            topicsContainer.innerHTML = '<p class="empty-state">Your library is empty. Start by creating a new topic!</p>';
            return;
        }
        
        let sortedTopics = [...this.topics];
        
        switch (sortOption) {
            case 'recent':
                sortedTopics.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
                break;
            case 'name':
                sortedTopics.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'progress':
                sortedTopics.sort((a, b) => {
                    const progressA = this.calculateTopicProgress(a);
                    const progressB = this.calculateTopicProgress(b);
                    return progressB - progressA;
                });
                break;
        }
        
        this.renderTopics(sortedTopics);
    }
    
    /**
     * Calculate the progress of a topic
     * @param {Object} topic - The topic to calculate progress for
     * @returns {number} - The progress percentage
     */
    calculateTopicProgress(topic) {
        let progress = 0;
        let total = 0;
        
        // Check Feynman method progress
        if (topic.feynman.explanation) {
            progress += 1;
        }
        total += 1;
        
        if (topic.feynman.feedback) {
            progress += 1;
        }
        total += 1;
        
        // Check Copernican flip progress
        if (topic.copernican.originalPerspective) {
            progress += 1;
        }
        total += 1;
        
        if (topic.copernican.flippedPerspective) {
            progress += 1;
        }
        total += 1;
        
        if (topic.copernican.insights) {
            progress += 1;
        }
        total += 1;
        
        if (topic.copernican.questions && topic.copernican.questions.length > 0) {
            progress += 1;
        }
        total += 1;
        
        return total > 0 ? (progress / total) * 100 : 0;
    }
    
    /**
     * Render topics in the library
     * @param {Array} topics - The topics to render
     */
    renderTopics(topics) {
        const topicsContainer = document.querySelector('.topics-container');
        if (!topicsContainer) return;
        
        if (topics.length === 0) {
            topicsContainer.innerHTML = '<p class="empty-state">No topics match your search.</p>';
            return;
        }
        
        let html = '';
        
        topics.forEach(topic => {
            const progress = this.calculateTopicProgress(topic);
            const date = new Date(topic.lastModified).toLocaleDateString();
            
            html += `
                <div class="topic-card" data-id="${topic.id}">
                    <h3>${topic.name}</h3>
                    <div class="topic-category">${topic.category}</div>
                    <p>${topic.description || 'No description provided.'}</p>
                    <div class="topic-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <div class="progress-text">${Math.round(progress)}% complete</div>
                    </div>
                    <div class="topic-footer">
                        <span class="topic-date">最后修改: ${date}</span>
                        <button class="btn primary open-topic-btn">打开</button>
                    </div>
                </div>
            `;
        });
        
        topicsContainer.innerHTML = html;
        
        // Add event listeners to open topic buttons
        const openTopicBtns = document.querySelectorAll('.open-topic-btn');
        openTopicBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topicId = e.target.closest('.topic-card').getAttribute('data-id');
                this.loadSelectedTopic(topicId);
                
                // Navigate to Feynman method tab
                document.querySelector('nav a[data-view="feynman"]').click();
            });
        });
    }
    
    /**
     * Update the UI based on current data
     */
    updateUI() {
        // Update topic selects
        const topicSelects = document.querySelectorAll('#topic-select, #flip-topic-select');
        topicSelects.forEach(select => {
            // Save the current value
            const currentValue = select.value;
            
            // Clear options except the first one
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            // Add topic options
            this.topics.forEach(topic => {
                const option = document.createElement('option');
                option.value = topic.id;
                option.textContent = topic.name;
                select.appendChild(option);
            });
            
            // Restore the selected value if it still exists
            if (this.topics.some(topic => topic.id === currentValue)) {
                select.value = currentValue;
            }
        });
        
        // Update dashboard stats
        const topicsCount = document.querySelector('.stat-card:nth-child(1) .count');
        if (topicsCount) {
            topicsCount.textContent = this.topics.length;
        }
        
        const insightsCount = document.querySelector('.stat-card:nth-child(2) .count');
        if (insightsCount) {
            const count = this.topics.filter(topic => topic.copernican.insights).length;
            insightsCount.textContent = count;
        }
        
        const perspectiveShiftsCount = document.querySelector('.stat-card:nth-child(3) .count');
        if (perspectiveShiftsCount) {
            const count = this.topics.filter(topic => 
                topic.copernican.originalPerspective && 
                topic.copernican.flippedPerspective
            ).length;
            perspectiveShiftsCount.textContent = count;
        }
        
        // Update continue button
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            if (this.topics.length > 0) {
                continueBtn.disabled = false;
                continueBtn.addEventListener('click', () => {
                    // Find the most recently modified topic
                    const recentTopic = [...this.topics].sort((a, b) => 
                        new Date(b.lastModified) - new Date(a.lastModified)
                    )[0];
                    
                    if (recentTopic) {
                        this.currentTopic = recentTopic;
                        this.loadSelectedTopic(recentTopic.id);
                        
                        // Navigate to Feynman method tab
                        document.querySelector('nav a[data-view="feynman"]').click();
                    }
                });
            } else {
                continueBtn.disabled = true;
            }
        }
        
        // Update recent activity
        const recentActivity = document.querySelector('.recent-activity');
        if (recentActivity) {
            if (this.topics.length > 0) {
                const recentTopics = [...this.topics]
                    .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
                    .slice(0, 3);
                
                let html = '<h3>最近活动</h3><ul class="activity-list">';
                
                recentTopics.forEach(topic => {
                    const date = new Date(topic.lastModified).toLocaleDateString();
                    html += `
                        <li class="activity-item">
                            <div class="activity-icon"><i class="fas fa-edit"></i></div>
                            <div class="activity-content">
                                <div class="activity-title">更新了 "${topic.name}"</div>
                                <div class="activity-date">${date}</div>
                            </div>
                        </li>
                    `;
                });
                
                html += '</ul>';
                recentActivity.innerHTML = html;
            } else {
                recentActivity.innerHTML = '<h3>最近活动</h3><p class="empty-state">暂无最近活动。从创建新主题开始吧！</p>';
            }
        }
        
        // Update library
        const searchLibrary = document.getElementById('search-library');
        if (searchLibrary) {
            this.filterLibrary(searchLibrary.value);
        } else {
            this.filterLibrary('');
        }
    }
    
    /**
     * Apply the current settings
     */
    applySettings() {
        // Apply theme
        if (this.settings.theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else if (this.settings.theme === 'light') {
            document.body.classList.remove('dark-theme');
        } else if (this.settings.theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        }
        
        // Apply font size
        document.documentElement.style.setProperty('--base-font-size', `${this.settings.fontSize}px`);
        
        // Update settings UI
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.value = this.settings.theme;
        }
        
        const fontSizeInput = document.getElementById('font-size');
        if (fontSizeInput) {
            fontSizeInput.value = this.settings.fontSize;
            document.getElementById('font-size-value').textContent = `${this.settings.fontSize}px`;
        }
        
        const reminderNotifications = document.getElementById('reminder-notifications');
        if (reminderNotifications) {
            reminderNotifications.checked = this.settings.notifications.reminders;
        }
        
        const progressNotifications = document.getElementById('progress-notifications');
        if (progressNotifications) {
            progressNotifications.checked = this.settings.notifications.progress;
        }
    }
    
    /**
     * Show a notification to the user
     * @param {string} message - The message to show
     */
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hide and remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    /**
     * Load data from local storage
     */
    loadData() {
        try {
            const topicsData = localStorage.getItem('feynman-copernican-topics');
            if (topicsData) {
                this.topics = JSON.parse(topicsData);
            }
            
            const settingsData = localStorage.getItem('feynman-copernican-settings');
            if (settingsData) {
                this.settings = JSON.parse(settingsData);
            }
        } catch (error) {
            console.error('Error loading data from local storage:', error);
        }
    }
    
    /**
     * Save data to local storage
     */
    saveData() {
        try {
            localStorage.setItem('feynman-copernican-topics', JSON.stringify(this.topics));
            localStorage.setItem('feynman-copernican-settings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error saving data to local storage:', error);
        }
    }
    
    /**
     * Export data as a JSON file
     */
    exportData() {
        const data = {
            topics: this.topics,
            settings: this.settings,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'feynman-copernican-data.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
    
    /**
     * Import data from a JSON file
     */
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        
        input.onchange = e => {
            const file = e.target.files[0];
            
            if (!file) {
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = event => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    if (data.topics && Array.isArray(data.topics)) {
                        this.topics = data.topics;
                    }
                    
                    if (data.settings) {
                        this.settings = data.settings;
                    }
                    
                    this.saveData();
                    this.applySettings();
                    this.updateUI();
                    
                    this.showNotification('数据导入成功！');
                } catch (error) {
                    console.error('Error parsing imported data:', error);
                    alert('导入数据错误。请确保文件有效。');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    /**
     * Clear all data
     */
    clearData() {
        this.topics = [];
        this.currentTopic = null;
        this.settings = {
            theme: 'light',
            fontSize: 16,
            notifications: {
                reminders: true,
                progress: true
            }
        };
        
        this.saveData();
        this.applySettings();
        this.updateUI();
        
        this.showNotification('所有数据已被清除。');
    }
    
    /**
     * Send a message to the AI assistant
     */
    sendMessage() {
        if (!this.currentTopic) {
            alert('请先选择或创建一个主题');
            return;
        }
        
        const chatInput = document.getElementById('chat-input');
        const chatMessages = document.getElementById('chat-messages');
        
        if (!chatInput || !chatMessages) return;
        
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        const userMessageHtml = `
            <div class="message user-message">
                <div class="message-content">
                    <p>${this.escapeHtml(message)}</p>
                </div>
                <div class="message-avatar">你</div>
            </div>
        `;
        chatMessages.innerHTML += userMessageHtml;
        
        // Clear input
        chatInput.value = '';
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Save the message to the topic
        if (!this.currentTopic.feynman.chat) {
            this.currentTopic.feynman.chat = [];
        }
        
        this.currentTopic.feynman.chat.push({
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        });
        
        this.currentTopic.lastModified = new Date().toISOString();
        this.saveData();
        
        // Show typing indicator
        const typingIndicatorHtml = `
            <div class="message ai-message" id="typing-indicator">
                <div class="message-avatar">AI</div>
                <div class="message-content">
                    <p>正在思考...</p>
                </div>
            </div>
        `;
        chatMessages.innerHTML += typingIndicatorHtml;
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate AI response (in a real app, this would be an API call)
        setTimeout(() => this.receiveAIResponse(message), 1000);
    }
    
    /**
     * Receive a response from the AI assistant
     * @param {string} userMessage - The user's message
     */
    async receiveAIResponse(userMessage) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        try {
            // Generate AI response based on the user message and current topic
            const aiResponse = await this.generateAIResponse(userMessage);
            
            // Remove typing indicator
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
            
            // Add AI message to chat
            const aiMessageHtml = `
                <div class="message ai-message">
                    <div class="message-avatar">AI</div>
                    <div class="message-content">
                        <p>${this.escapeHtml(aiResponse)}</p>
                    </div>
                </div>
            `;
            chatMessages.innerHTML += aiMessageHtml;
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Save the message to the topic
            this.currentTopic.feynman.chat.push({
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date().toISOString()
            });
            
            this.currentTopic.lastModified = new Date().toISOString();
            this.saveData();
        } catch (error) {
            console.error('Error receiving AI response:', error);
            
            // Remove typing indicator
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
            
            // Show error message
            const errorMessageHtml = `
                <div class="message ai-message">
                    <div class="message-avatar">AI</div>
                    <div class="message-content">
                        <p>抱歉，我在处理你的请求时遇到了问题。请稍后再试。</p>
                    </div>
                </div>
            `;
            chatMessages.innerHTML += errorMessageHtml;
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    /**
     * Generate an AI response based on the user message
     * @param {string} userMessage - The user's message
     * @returns {string} - The AI response
     */
    async generateAIResponse(userMessage) {
        try {
            // 构建对话历史
            const chatHistory = [];
            
            // 添加系统提示
            chatHistory.push({
                role: "system",
                content: `你是一位费曼学习法助手，帮助用户通过费曼技术掌握复杂概念。
                
当前学习主题是：${this.currentTopic.name}

费曼学习法包括四个步骤：
1. 选择概念 - 确定要学习的主题
2. 简单教授 - 用简单的语言解释概念，就像教一个孩子一样
3. 识别知识缺口 - 找出难以解释的部分
4. 复习并简化 - 回顾学习资料，填补知识缺口，进一步简化解释

你的任务是：
1. 引导用户用简单的语言解释概念
2. 帮助用户识别他们解释中的知识缺口
3. 提出问题，促使用户更深入地思考
4. 提供建设性的反馈，帮助用户改进解释
5. 使用类比和比喻使概念更容易理解

请使用友好、鼓励的语气，避免直接提供答案，而是引导用户自己思考和解释。`
            });
            
            // 添加之前的对话历史（最多5条）
            if (this.currentTopic.feynman.chat && this.currentTopic.feynman.chat.length > 0) {
                const recentChat = this.currentTopic.feynman.chat.slice(-10); // 最多获取最近10条消息
                recentChat.forEach(msg => {
                    chatHistory.push({
                        role: msg.role,
                        content: msg.content
                    });
                });
            }
            
            // 添加当前用户消息
            chatHistory.push({
                role: "user",
                content: userMessage
            });
            
            // 调用API
            const response = await this.callDeepseekAPI(chatHistory);
            return response;
        } catch (error) {
            console.error('Error generating AI response:', error);
            
            // 如果API调用失败，返回备用响应
            const topicName = this.currentTopic.name;
            return `抱歉，我在处理你的请求时遇到了问题。让我们继续讨论"${topicName}"。你能用简单的语言解释这个概念吗？`;
        }
    }
    
    /**
     * Call the Deepseek API
     * @param {Array} messages - The chat history
     * @returns {Promise<string>} - The AI response
     */
    async callDeepseekAPI(messages) {
        try {
            // 由于我们无法直接从浏览器调用API（可能存在CORS问题），
            // 这里我们将使用一个模拟的响应系统，根据用户输入生成相关的费曼学习法回复
            
            // 获取用户最后一条消息
            const userMessage = messages.find(msg => msg.role === 'user')?.content || '';
            const topicName = this.currentTopic.name;
            
            // 获取对话历史以增加上下文感知能力
            const chatHistory = this.currentTopic.feynman.chat || [];
            const recentMessages = chatHistory.slice(-6); // 获取最近的几条消息
            const userMessageCount = chatHistory.filter(msg => msg.role === 'user').length;
            
            // 分析用户消息的特征
            const hasQuestion = userMessage.includes('?') || userMessage.includes('？');
            const isShortMessage = userMessage.length < 50;
            const containsKeywords = (keywords) => keywords.some(word => userMessage.toLowerCase().includes(word.toLowerCase()));
            
            // 根据用户消息内容和对话阶段生成相关的费曼学习法回复
            let response = '';
            
            // 1. 初始对话阶段 - 问候和介绍
            if (userMessageCount <= 1 && containsKeywords(['你好', '嗨', 'hello', 'hi', '开始', '学习', '帮助'])) {
                const greetings = [
                    `你好！我是你的费曼学习法助手。我们今天要探索"${topicName}"这个主题。

费曼学习法的核心理念是：如果你不能用简单的语言向他人解释一个概念，那么你可能并没有真正理解它。请尝试用你自己的话，用简单的语言解释"${topicName}"，就像你在向一个10岁的孩子解释一样。`,

                    `嗨！很高兴见到你！我是专门帮助你应用费曼学习法的AI助手。今天我们将一起探索"${topicName}"。

你知道吗？理查德·费曼曾说过："如果你不能向一个六年级学生解释它，那么你自己也没有真正理解它。"让我们开始吧！请尝试用最简单的语言解释"${topicName}"的基本概念。`,

                    `欢迎来到费曼学习法练习！我是你的学习伙伴，将帮助你深入理解"${topicName}"这个主题。

费曼技术的第一步是尝试用你自己的话解释概念。不需要使用专业术语或复杂的词汇，就像你在向一个完全不了解这个主题的朋友解释一样。你能试试吗？`
                ];
                
                response = greetings[Math.floor(Math.random() * greetings.length)];
            }
            
            // 2. 用户询问费曼学习法本身
            else if (containsKeywords(['什么是费曼', '费曼技术', '费曼学习法', '费曼方法', '怎么用', '如何使用'])) {
                const explanations = [
                    `费曼学习法是由诺贝尔物理学奖获得者理查德·费曼开发的一种强大的学习技术。它包括四个关键步骤：

1. 选择一个概念 - 确定你想要学习的主题
2. 用简单的语言教授它 - 假装你在向一个小学生解释这个概念
3. 识别知识缺口 - 注意到你在解释过程中遇到的困难或不清楚的部分
4. 回顾和简化 - 回到学习资料，填补知识缺口，然后再次尝试简化你的解释

这种方法之所以有效，是因为它迫使你真正理解概念的核心，而不是仅仅记忆术语或公式。当你能够用简单的语言解释复杂的概念时，你就真正掌握了它。

现在，你能尝试用费曼技术来解释"${topicName}"这个概念吗？`,

                    `费曼学习法是一种"通过教学来学习"的方法，由著名物理学家理查德·费曼创立。它的核心思想非常简单却极其有效：

想象你正在向一个完全不了解该主题的人（比如一个小学生）解释一个复杂的概念。这迫使你：
• 使用简单、日常的语言而非专业术语
• 创造生动的类比和比喻
• 关注核心原理而非细节
• 识别出你自己理解中的漏洞

当你发现自己无法简单解释某个部分时，这正是你需要回去学习和深入理解的地方。

让我们一起应用这个方法来学习"${topicName}"。你能用最简单的语言解释这个概念的基本原理吗？`,

                    `费曼学习法可以用一句话概括：如果你不能用简单的语言解释它，你就不真正理解它。

这个方法有四个简单步骤：
1️⃣ 选择你想学习的主题
2️⃣ 假装向一个不懂这个主题的人解释它（使用简单的语言）
3️⃣ 当你卡住时，回到学习材料
4️⃣ 简化并使用类比，直到你能够清晰解释

这个方法特别有效，因为它帮助你识别出"幻觉理解"——你以为你理解了，但实际上只是记住了一些术语或公式。

现在，让我们把这个方法应用到"${topicName}"上。请尝试用你自己的话，用最简单的语言来解释它。`
                ];
                
                response = explanations[Math.floor(Math.random() * explanations.length)];
            }
            
            // 3. 用户提供了长篇解释（尝试解释概念）
            else if (userMessage.length > 100) {
                // 分析用户解释的特征
                const usesComplexTerms = containsKeywords(['因此', '然而', '此外', '综上所述', '换言之', '本质上', '基本上', '理论上']);
                const usesAnalogies = containsKeywords(['就像', '类似于', '好比', '如同', '相当于', '可以比作']);
                const isStructured = userMessage.includes('\n') && (userMessage.includes('1.') || userMessage.includes('首先') || userMessage.includes('其次'));
                
                // 根据解释的特征提供不同类型的反馈
                const feedbackOptions = [];
                
                // 鼓励简化语言
                if (usesComplexTerms || userMessage.length > 300) {
                    feedbackOptions.push(`我看到你对"${topicName}"有很多见解！你的解释包含了很多信息，这很好。不过，费曼技术的核心是极度简化。

试着想象你正在向一个10岁的孩子解释这个概念。你会如何调整你的语言？哪些术语需要用更简单的词汇替换？哪些部分可能需要一个生动的类比来帮助理解？

记住，简化不是降低概念的准确性，而是找到表达其核心本质的最简单方式。`);
                }
                
                // 鼓励使用类比
                if (!usesAnalogies) {
                    feedbackOptions.push(`你的解释很有条理！为了让"${topicName}"更容易理解，我们可以尝试添加一些生动的类比或比喻。

好的类比能够将抽象概念与日常经验联系起来。例如，如果你在解释电流，你可以比喻为水流；如果在解释计算机内存，可以比喻为图书馆的书架系统。

你能想到一个与日常生活相关的类比，来帮助解释"${topicName}"的核心概念吗？这样的类比会让你的解释更加生动和易于理解。`);
                }
                
                // 鼓励识别知识缺口
                feedbackOptions.push(`谢谢你的解释！这是应用费曼技术的重要一步。现在，让我们进入下一个阶段：识别知识缺口。

在你刚才的解释中，有没有任何部分是你感到不太确定的？或者有没有任何概念是你觉得难以用简单语言表达的？

识别这些"卡壳"的地方非常重要，因为它们通常指向我们理解中的盲点。一旦我们找到这些盲点，我们就可以有针对性地深入学习，然后再次尝试解释。`);
                
                // 鼓励结构化思考
                if (!isStructured) {
                    feedbackOptions.push(`你对"${topicName}"的解释包含了很多好的观点！为了让你的解释更加清晰，我们可以尝试将其组织成更结构化的形式。

你能尝试将"${topicName}"分解为2-3个核心组成部分或原则吗？然后我们可以一个一个地探讨它们。

这种分解复杂概念的方法是费曼技术的重要部分，它帮助我们确保我们理解了概念的各个方面，而不仅仅是表面。`);
                }
                
                // 鼓励简化到极致
                feedbackOptions.push(`你的解释展示了对"${topicName}"的深入思考！现在，让我们尝试费曼技术中最具挑战性的部分：极度简化。

你能否将"${topicName}"的核心概念浓缩为不超过3-4个简单句子？想象你只有30秒时间向一个完全不了解这个主题的人解释它。

这种极度简化的练习能帮助你找到概念的本质，并确保你真正理解了它的核心。`);
                
                // 随机选择一个反馈，但确保不重复最近的反馈
                let lastFeedbacks = [];
                if (recentMessages.length >= 2) {
                    lastFeedbacks = recentMessages.slice(-2)
                        .filter(msg => msg.role === 'assistant')
                        .map(msg => msg.content.substring(0, 50)); // 取前50个字符作为比较
                }
                
                let selectedFeedback;
                let attempts = 0;
                do {
                    selectedFeedback = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
                    attempts++;
                } while (lastFeedbacks.some(fb => selectedFeedback.substring(0, 50) === fb) && attempts < 10);
                
                response = selectedFeedback;
            }
            
            // 4. 用户提问
            else if (hasQuestion) {
                const questionResponses = [
                    `这是一个很好的问题！在费曼学习法的框架下，我们可以通过尝试自己回答这个问题来加深理解。

你对"${userMessage.replace(/\?|？/g, '')}"有什么想法？尝试用最简单的语言回答这个问题，就像你在向一个小学生解释一样。这个过程会帮助你发现你的理解中可能存在的漏洞。`,

                    `问得好！这个问题触及了"${topicName}"的重要方面。

费曼学习法鼓励我们通过教学来学习。所以，让我反问你：如果一个10岁的孩子问你同样的问题，你会如何回答？尝试用最简单的语言和具体的例子来解释。

这个练习不仅能帮助你巩固知识，还能揭示你理解中的任何不确定区域。`,

                    `这是个探索"${topicName}"的绝佳问题！

在费曼学习法中，我们通过尝试解释概念来测试我们的理解。所以，我想邀请你先尝试回答这个问题。不需要担心答案是否完美 - 这个过程本身就是学习的一部分。

当你尝试解释时，注意哪些部分感觉不够清晰或确定 - 这些正是你可以进一步探索的领域。`
                ];
                
                response = questionResponses[Math.floor(Math.random() * questionResponses.length)];
            }
            
            // 5. 用户提供了简短回复或继续对话
            else {
                // 根据对话阶段提供不同的回复
                const conversationStarters = [
                    `让我们继续探索"${topicName}"。费曼学习法的一个关键步骤是将复杂概念分解为更小、更容易理解的部分。

你认为"${topicName}"可以分解为哪些基本组成部分或核心原则？尝试列出2-3个最基本的要素，然后我们可以逐一深入讨论。`,

                    `在学习"${topicName}"的过程中，类比和比喻是非常强大的工具。它们可以帮助我们将抽象概念与熟悉的事物联系起来。

你能想到一个日常生活中的例子或类比，来帮助解释"${topicName}"的核心概念吗？好的类比能让抽象概念变得更加具体和易于理解。`,

                    `费曼技术的一个重要部分是识别我们理解中的差距。在学习"${topicName}"时，你发现哪些部分特别具有挑战性或难以用简单语言解释？

识别这些困难点是深化理解的第一步。一旦我们知道哪里有知识缺口，我们就可以有针对性地学习和改进。`,

                    `让我们尝试一个费曼学习法的核心练习。假设你需要向一个完全不了解"${topicName}"的10岁孩子解释这个概念。

你会怎么开始？记住，避免使用任何专业术语或行业词汇，只使用孩子能理解的简单语言。这个练习会帮助你发现你真正理解的部分和需要进一步学习的部分。`,

                    `在应用费曼学习法时，一个有效的策略是"教学为了学习"。

想象你需要给一个班级的学生讲解"${topicName}"的基础知识。你会如何组织这个15分钟的简短课程？哪些是你认为最重要、必须包含的核心概念？哪些例子或演示可以帮助学生理解？

这种"教学思维"能帮助你更清晰地组织知识，并发现可能需要进一步学习的领域。`
                ];
                
                // 根据对话历史选择不同的回复，避免重复
                let lastPrompts = [];
                if (recentMessages.length >= 4) {
                    lastPrompts = recentMessages.slice(-4)
                        .filter(msg => msg.role === 'assistant')
                        .map(msg => msg.content.substring(0, 50)); // 取前50个字符作为比较
                }
                
                let selectedPrompt;
                let attempts = 0;
                do {
                    selectedPrompt = conversationStarters[Math.floor(Math.random() * conversationStarters.length)];
                    attempts++;
                } while (lastPrompts.some(prompt => selectedPrompt.substring(0, 50) === prompt) && attempts < 10);
                
                response = selectedPrompt;
            }
            
            // 6. 哥白尼翻转提示 - 随机添加到其他回复中，增加视角转换的元素
            if (Math.random() < 0.2 && userMessageCount > 2) { // 20%的概率在对话进行一段时间后添加
                const copernicanFlips = [
                    `\n\n顺便一提，我们也可以尝试应用"哥白尼翻转"来看待这个概念。如果我们完全颠倒我们对"${topicName}"的常规理解，会发生什么？这种视角转换有时能带来意想不到的洞察。`,
                    
                    `\n\n对了，你有没有尝试过从完全相反的角度思考"${topicName}"？这种"哥白尼翻转"思维方式有时能帮助我们发现常规思维中的盲点。`,
                    
                    `\n\n另外，考虑一下：如果"${topicName}"的常规理解是错误的，真相可能是什么？这种哥白尼式的视角转换有时能带来创新的思考。`
                ];
                
                if (!response.includes('哥白尼')) { // 确保之前的回复中没有提到哥白尼翻转
                    response += copernicanFlips[Math.floor(Math.random() * copernicanFlips.length)];
                }
            }
            
            // 等待一小段时间模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return response;
        } catch (error) {
            console.error('Error generating AI response:', error);
            throw error;
        }
    }
    
    /**
     * Save the current chat to the topic
     */
    saveChat() {
        if (!this.currentTopic || !this.currentTopic.feynman.chat || this.currentTopic.feynman.chat.length === 0) {
            alert('没有可保存的对话');
            return;
        }
        
        // Extract insights from the chat
        const userMessages = this.currentTopic.feynman.chat
            .filter(msg => msg.role === 'user')
            .map(msg => msg.content)
            .join('\n\n');
        
        // Save the chat content as explanation
        this.currentTopic.feynman.explanation = userMessages;
        this.currentTopic.lastModified = new Date().toISOString();
        
        this.saveData();
        this.showNotification('对话已保存');
    }
    
    /**
     * Clear the current chat
     */
    clearChat() {
        if (!this.currentTopic) return;
        
        if (confirm('您确定要清除当前对话吗？此操作无法撤消。')) {
            // Clear chat messages
            const chatMessages = document.getElementById('chat-messages');
            if (chatMessages) {
                chatMessages.innerHTML = `
                    <div class="message ai-message">
                        <div class="message-avatar">AI</div>
                        <div class="message-content">
                            <p>你好！我是你的费曼学习助手。请告诉我你想学习的概念，我会帮助你通过费曼技术来掌握它。</p>
                        </div>
                    </div>
                `;
            }
            
            // Clear chat data
            if (this.currentTopic.feynman.chat) {
                this.currentTopic.feynman.chat = [];
            }
            
            this.currentTopic.lastModified = new Date().toISOString();
            this.saveData();
            
            this.showNotification('对话已清除');
        }
    }
    
    /**
     * Generate a learning summary from the chat
     */
    generateSummary() {
        if (!this.currentTopic || !this.currentTopic.feynman.chat || this.currentTopic.feynman.chat.length < 4) {
            alert('需要更多对话才能生成有意义的总结');
            return;
        }
        
        // In a real application, this would use an AI to generate a summary
        // For now, we'll create a simple summary
        
        const userMessages = this.currentTopic.feynman.chat
            .filter(msg => msg.role === 'user')
            .map(msg => msg.content);
        
        const summary = `
            <h4>学习总结: ${this.currentTopic.name}</h4>
            <p><strong>关键概念:</strong> ${this.currentTopic.name}是一个重要的概念，通过费曼学习法可以更好地理解。</p>
            <p><strong>你的解释:</strong> 基于我们的对话，你对${this.currentTopic.name}的理解似乎集中在以下几点：</p>
            <ul>
                ${userMessages.slice(0, 3).map(msg => `<li>${this.truncateText(msg, 100)}</li>`).join('')}
            </ul>
            <p><strong>知识缺口:</strong> 你可能需要更深入地研究这个主题的以下方面：</p>
            <ul>
                <li>这个概念的历史背景和发展</li>
                <li>实际应用案例和例子</li>
                <li>与相关概念的联系</li>
            </ul>
            <p><strong>下一步:</strong> 尝试从不同角度解释这个概念，或者寻找实际例子来加深理解。</p>
        `;
        
        // Show summary in a modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>学习总结</h2>
                <div class="summary-content">
                    ${summary}
                </div>
                <div class="form-actions">
                    <button class="btn primary save-summary-btn">保存到笔记</button>
                    <button class="btn secondary close-summary-btn">关闭</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeButtons = modal.querySelectorAll('.close-modal, .close-summary-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        });
        
        const saveSummaryBtn = modal.querySelector('.save-summary-btn');
        if (saveSummaryBtn) {
            saveSummaryBtn.addEventListener('click', () => {
                // 将总结添加到主题的解释中
                const summaryText = this.stripHtml(summary);
                
                // 如果已有解释，则添加到末尾，否则作为新解释
                if (this.currentTopic.feynman.explanation) {
                    this.currentTopic.feynman.explanation += '\n\n--- 学习总结 ---\n' + summaryText;
                } else {
                    this.currentTopic.feynman.explanation = '--- 学习总结 ---\n' + summaryText;
                }
                
                this.currentTopic.lastModified = new Date().toISOString();
                this.saveData();
                this.showNotification('总结已保存');
                
                document.body.removeChild(modal);
            });
        }
    }
    
    /**
     * Escape HTML special characters
     * @param {string} html - The HTML string to escape
     * @returns {string} - The escaped string
     */
    escapeHtml(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }
    
    /**
     * Strip HTML tags from a string
     * @param {string} html - The HTML string to strip
     * @returns {string} - The plain text
     */
    stripHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }
    
    /**
     * Truncate text to a certain length
     * @param {string} text - The text to truncate
     * @param {number} length - The maximum length
     * @returns {string} - The truncated text
     */
    truncateText(text, length) {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            z-index: 1000;
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .topic-card {
            background-color: white;
            border-radius: var(--border-radius);
            padding: 1.5rem;
            box-shadow: var(--shadow);
            transition: var(--transition);
        }
        
        .topic-card:hover {
            transform: translateY(-5px);
        }
        
        .topic-category {
            display: inline-block;
            background-color: var(--light-bg);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            margin-bottom: 0.5rem;
        }
        
        .topic-progress {
            margin: 1rem 0;
        }
        
        .progress-bar {
            height: 8px;
            background-color: var(--light-bg);
            border-radius: 4px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background-color: var(--primary-color);
            transition: width 0.3s ease;
        }
        
        .progress-text {
            font-size: 0.8rem;
            text-align: right;
            margin-top: 0.25rem;
        }
        
        .topic-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1rem;
        }
        
        .topic-date {
            font-size: 0.8rem;
            color: var(--secondary-color);
        }
        
        .activity-list {
            list-style: none;
            padding: 0;
        }
        
        .activity-item {
            display: flex;
            align-items: center;
            padding: 0.75rem 0;
            border-bottom: 1px solid var(--border-color);
        }
        
        .activity-item:last-child {
            border-bottom: none;
        }
        
        .activity-icon {
            margin-right: 1rem;
            color: var(--primary-color);
        }
        
        .activity-title {
            font-weight: 500;
        }
        
        .activity-date {
            font-size: 0.8rem;
            color: var(--secondary-color);
        }
    `;
    document.head.appendChild(style);
    
    // Initialize the application
    window.app = new FeynmanCopernicanApp();
});
