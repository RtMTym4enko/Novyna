import React from 'react';
import { TagPanel } from './TagPanel';
import { NewsPanel } from './NewsPanel';

function MainPage() {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col">
                    <NewsPanel />
                </div>
                <div className="col-auto">
                    <TagPanel />
                </div>
            </div>
        </div>
    );
}

export default MainPage;