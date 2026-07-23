import React from 'react';
import './StoryPageHeader.scss';

export function StoryPageHeader({actions, className = '', description, eyebrow, title}) {
    const classes = [
        'story-page-header',
        actions ? 'with-actions' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <header className={classes}>
            <div className="copy">
                <span>{eyebrow}</span>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            {actions && <div className="actions">{actions}</div>}
        </header>
    );
}
