class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (typeof config === "undefined") {
            throw new Error();
        }
        this._initial = config.initial;
        this._current = config.initial;
        this._states = config.states;
        this._undoHistory = [];
        this._redoHistory = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this._current;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this._states.hasOwnProperty(state)) {
            this._undoHistory.push(this._current);
            this._redoHistory = [];
            this._current = state;
        } else {
            throw new Error();
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        const currentTransitions = this._states[this._current].transitions;
        if (currentTransitions.hasOwnProperty(event)) {
            this._undoHistory.push(this._current);
            this._redoHistory = [];
            this._current = currentTransitions[event];
        } else {
            throw new Error('Error');
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this._current = this._initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let arrayOfStates = [];
        if (typeof event === "undefined") {
            return Object.keys(this._states)
        } else if (event) {
            for (let key in this._states) {
                if (this._states[key].transitions[event]) {
                    arrayOfStates = [...arrayOfStates, key];
                }
            }
        }
        return arrayOfStates;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this._undoHistory.length < 1) {
            return false;
        } else {
            this._redoHistory.push(this._current);
            this._current = this._undoHistory.pop();
            return true;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this._redoHistory.length < 1) {
            return false;
        } else {
            this._undoHistory.push(this._current);
            this._current = this._redoHistory.pop();
            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this._undoHistory = [];
        this._redoHistory = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/