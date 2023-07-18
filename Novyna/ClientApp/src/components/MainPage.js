import React, { useState } from 'react';
import { TagPanel } from './TagPanel';
import { NewsPanel } from './NewsPanel';

function MainPage() { 
    const [selectedTag, setSelectedTag] = useState(null);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col">
                    <NewsPanel selectedTag={selectedTag} />
                </div>
                <div className="col-auto">
                    <TagPanel onTagSelected={(t) => setSelectedTag(t)} />
                </div>
            </div>
        </div>
    );
}

export default MainPage;