import React, { Component, createRef } from 'react';
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.onHeaderScroll = this.onHeaderScroll.bind(this);
        this.onContentScroll = this.onContentScroll.bind(this);

        this.count = 500;
        this.resetTimeoutMs = 100;

        this.headerRefs = [];
        this.contentRefs = [];
        this.isHeaderScrolling = false;
        this.isContentScrolling = false;
        this.headerSize = 0;
        this.contentSize = 0;
    }

    onHeaderScroll(e) {

        if (!this.isContentScrolling) {

            console.log(`onHeaderScroll`);

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

            const ref = this.contentRefs[centered].current;
            ref.scrollIntoView({behavior: 'smooth'});
            clearTimeout(this.timeoutId);

            this.timeoutId = setTimeout(() => {
                this.isHeaderScrolling = false;
            }, this.resetTimeoutMs);
        }
    }

    onContentScroll(e) {

        if (!this.isHeaderScrolling) {

            this.isContentScrolling = true;
            e.persist();

            const centered = this.contentRefs.reduce((acc, _, index) => {
                const clientRect = _.current.getBoundingClientRect();
                if (clientRect.top <= this.contentSize.top && clientRect.bottom > this.contentSize.top) {
                    return index;
                }
                return acc;
            }, -1);

            if (centered !== -1) {
                const ref = this.headerRefs[centered].current;
                ref.scrollIntoView({behavior: 'instant'});
                clearTimeout(this.timeoutId);

                this.timeoutId = setTimeout(() => {
                    this.isContentScrolling = false;
                }, this.resetTimeoutMs);
            }
        }
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
            headers.push(<div className="cell" key={i} ref={headerRef}>{i}</div>);

            const contentRef = createRef();
            this.contentRefs.push(contentRef);
            contents.push(<div className="row" key={i} ref={contentRef}>{i}</div>);
        }

        return (
            <div className="App">

                <div className="Content" ref={this.contentRefCallback}>
                    {contents}
                </div>

                <div className="Header" onScroll={this.onHeaderScroll} ref={this.headerRefCallback}>
                    {headers}
                </div>

                <div className="Title">
                    scroll-sync
                </div>
            </div>
        );
    }
}

export default App;
