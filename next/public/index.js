/* eslint-disable no-undef */
function whoIsWho(id,statistic) {
    if (statistic) {
        if ((statistic.frequency >= 2 || statistic.frequency_tick >= 5) && statistic.comment_count >= 50 && statistic.days_tick >= 10) {
            return true;
        }
    }
}
window.whoIsWho = whoIsWho;