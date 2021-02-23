import React, { Component, createRef } from 'react';
import './App.css';

const log = console.log

class App extends Component {

    constructor(props) {
        super(props);
        this.onHeaderScroll = this.onHeaderScroll.bind(this);
        this.onContentScroll = this.onContentScroll.bind(this);

        this.onHeaderClick = this.onHeaderClick.bind(this);

        this.count = 500;
        this.resetTimeoutMs = 250;

        this.headerRefs = [];
        this.contentRefs = [];
        this.isHeaderScrolling = false;
        this.isContentScrolling = false;
        this.headerSize = 0;
        this.contentSize = 0;
    }

    onHeaderScroll(e) {

        if (!this.isContentScrolling) {

            log(`onHeaderScroll`);

            this.isHeaderScrolling = true;
            e.persist();

            const centered = this.headerRefs.reduce((acc, _, index) => {
                const center = this.headerSize.width / 2;
                const clientRect = _.current.getBoundingClientRect();
                if (clientRect.left <= center && clientRect.right > center) {
                    return index;
                }
                return acc;
            }, 0);

            this.scrollContentToIndex(centered);
        }
    }

    onContentScroll(e) {
        //log('this.isHeaderScrolling', this.isHeaderScrolling)

        if (!this.isHeaderScrolling) {

            log(`onContentScroll`);

            this.isContentScrolling = true;
            e.persist();

            const centered = this.contentRefs.reduce((acc, _, index) => {
                const clientRect = _.current.getBoundingClientRect();
                if (clientRect.top <= this.contentSize.top && clientRect.bottom > this.contentSize.top) {
                    return index;
                }
                return acc;
            }, -1);

            log(`centered`, centered);

            if (centered !== -1) {

                this.headerRefs.map(_ => {
                    _.current.style.background = 'transparent';
                    _.current.style.borderBottomColor = 'transparent';
                });

                const ref = this.headerRefs[centered].current;

                ref.style.background = '#000';
                ref.style.borderBottomColor = '#f00';

                ref.scrollIntoView({behavior: 'instant'});

                clearTimeout(this.timeoutId);

                this.timeoutId = setTimeout(() => {
                    this.isContentScrolling = false;
                }, this.resetTimeoutMs);
            }
        }
    }

    onHeaderClick(key, headerRef) {
        log('onHeaderClick', key, headerRef);
        this.scrollContentToIndex(key);
    }


    scrollContentToIndex(key) {
        log(`scrollContentToIndex`, key);
        const ref = this.contentRefs[key].current;
        ref.scrollIntoView(true);
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.isHeaderScrolling = false;
        }, this.resetTimeoutMs);
    }


    headerRefCallback = element => {
        if (element) {
            const size = element.getBoundingClientRect();
            console.log(`update header size`, size);
            this.headerSize = size;
        }
    };

    contentRefCallback = element => {
        if (element) {
            const size = element.getBoundingClientRect();
            console.log(`update content size`, size);
            this.contentSize = size;
        }
    };

    render() {
        const headers = [];
        const contents = [];

        for (let i = 0; i < this.count; i++) {
            const headerRef = createRef();
            this.headerRefs.push(headerRef);
            headers.push(<div className="cell" key={i} ref={headerRef} onClick={() => this.onHeaderClick(i, headerRef)} >{i}</div>);

            const contentRef = createRef();
            this.contentRefs.push(contentRef);
            contents.push(<div className="row" key={i} ref={contentRef}>{i}</div>);
        }

        return (
            <div className="App">

                <div className="Header" ref={this.headerRefCallback}>
                    {headers}
                </div>

                <div className="Content" onScroll={this.onContentScroll} ref={this.contentRefCallback}>
                    {contents}
                </div>
            </div>
        );
    }
}

export default App;
