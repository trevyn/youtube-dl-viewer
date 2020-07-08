function escapeHtml(text) {
    if (typeof text !== "string") text = (""+text).toString();
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function formatSeconds(sec) {
    if (sec <= 60) return sec + 's';

    const omin = Math.floor(sec/60);
    const osec = Math.floor(sec - (omin*60));
    return omin + 'min ' + osec + 's';
}

function formatDate(date) {
    return date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.sub(6, 2);
}

window.onload = function() { 
    initData();
    initButtons();
};

function initData()
{
    const json_proto = 
    {
        has: function(key) { return Object.hasOwnProperty.call(this, key); },
        hasNonNull: function(key) { return this.has(key) && this[key] != null; },
        hasArrayWithValues: function(key) { return this.hasNonNull(key) && Object.hasOwnProperty.call(this[key], 'length') && this[key].length > 0; },
    }
        
    const data = JSON.parse(document.querySelector('#json_data').getAttribute('data-json'));

    let html = '';
    for (const vid of data['videos'])
    {
        const meta = vid['meta'];
        const info = vid['data']['info'];

        info.__proto__ = json_proto;

        html += '<div class="video_entry" data-id="'+escapeHtml(meta['uid'])+'">';

        if (info.hasNonNull('thumbnail')) html += '<div class="thumbnail"><img src="/thumb_empty.svg"  alt="thumbnail" data-realurl="/thumb/'+escapeHtml(meta['uid'])+'." /></div>';
        else html += '<hasNoNull class="thumbnail"><img src="/thumb_empty.svg" alt="thumbnail" /></hasNoNull>';
        
        if (info.hasNonNull('fulltitle')) html += '<div class="title">' + escapeHtml(info['fulltitle']) + '</div>';
        else if (info.hasNonNull('title')) html += '<div class="title">' + escapeHtml(info['title']) + '</div>';

        if (info.hasArrayWithValues('category')) 
        {
            html += '<div class="catlist">';
            for (const c of info['category']) html += '<div class="category">' + escapeHtml(c) + '</div>';
            html += '</div>';
        }
        
        if (info.hasArrayWithValues('tags'))
        {
            html += '<div class="taglist">';
            for (const t of info['tags']) html += '<div class="tag">' + escapeHtml(t) + '</div>';
            html += '</div>';
        }

        if (info.hasNonNull('webpage_url')) html += '<a href="' + escapeHtml(info['webpage_url']) + '" class="url">' + escapeHtml(info['webpage_url']) + '</a>';

        if (info.hasNonNull('duration')) html += '<div class="duration">' + escapeHtml(formatSeconds(info["duration"])) + '</div>';

        if (info.hasNonNull('extractor')) html += '<div class="extractor">' + escapeHtml(info["extractor"]) + '</div>';

        if (info.hasNonNull('uploader')) html += '<div class="uploader">' + escapeHtml(info["uploader"]) + '</div>';

        if (info.hasNonNull('like_count') && info.has('dislike_count')) 
        {
            html += '<div class="like_count">' + escapeHtml(info["like_count"]) + '</div>';
            html += '<div class="dislike_count">' + escapeHtml(info["dislike_count"]) + '</div>';
        }

        if (info.hasNonNull('view_count')) html += '<div class="view_count">' + escapeHtml(info["view_count"]) + '</div>';

        if (info.hasNonNull('width') && info.has('height')) html += '<div class="size">' + escapeHtml(info["width"]) + 'x' + escapeHtml(info["height"]) + '</div>';

        if (info.hasNonNull('upload_date')) html += '<div class="view_count">' + escapeHtml(formatDate(info["upload_date"])) + '</div>';

        html += '</div>';
        html += "\n\n";
    }

    document.querySelector('main').innerHTML = html;
}

function initButtons()
{
    document.querySelector('.btn-display').addEventListener('click', () => 
    {
        const main = document.querySelector('main');
        
             if (main.classList.contains('lstyle_detailed')) { main.classList.remove('lstyle_detailed'); main.classList.add('lstyle_grid');     }
        else if (main.classList.contains('lstyle_grid'))     { main.classList.remove('lstyle_grid');     main.classList.add('lstyle_compact');  }
        else if (main.classList.contains('lstyle_compact'))  { main.classList.remove('lstyle_compact');  main.classList.add('lstyle_tabular');  }
        else if (main.classList.contains('lstyle_tabular'))  { main.classList.remove('lstyle_tabular');  main.classList.add('lstyle_detailed'); }
    });

    document.querySelector('.btn-order').addEventListener('click', () =>
    {
        //TODO
    });
}