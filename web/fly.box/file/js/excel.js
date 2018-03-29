$(function () {
    var table = $('table')[0];
    for (var i = table.rows.length - 1; i > 5; i--) {
        var row = table.rows[i];
        
        if (!(row.innerText || row.contentText)) {
            try {
                row.className='tr-hidden'
                //row.style.visibility = 'hidden'
            } catch (e) {
                break;
            }
        }
        else {
            break
        }
    }
})