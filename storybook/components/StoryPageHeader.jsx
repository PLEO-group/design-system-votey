import React from 'react';
import './StoryPageHeader.css';

export function StoryPageHeader({actions, className = '', description, eyebrow, title}) {
    const classes = [
        'story-page-header',
        actions ? 'story-page-header--with-actions' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <header className={classes}>
            <div className="story-page-header__copy">
                <span>{eyebrow}</span>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            {actions && <div className="story-page-header__actions">{actions}</div>}
        </header>
    );
}
