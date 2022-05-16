export default {
    historyIndex: -1,

    addHistory (index) {
        this.historyIndex = index
    },

    existsInHistory (index) {
        return index > this.historyIndex
    },

    clearHistory () {
        this.historyIndex = -1
    }
}