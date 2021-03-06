/* eslint-disable no-param-reassign */
/*
 * @Description: bilibili spider
 * @Author: ekibun
 * @Date: 2019-08-02 13:36:17
 * @LastEditors  : ekibun
 * @LastEditTime : 2020-01-04 13:53:36
 */

/**
 * @this { import('../utils').This }
 */
async function bilibili(site) {
    const data = await this.safeRequest(`https://bangumi.bilibili.com/view/web_api/media?media_id=${site.id}`);
    const airInfo = data.result && data.result.episode_index && /每(周[一二三四五六日])\s?(\d{2}:\d{2})更新/g.exec(data.result.episode_index.index_show);
    if (airInfo) {
        site.week = '一二三四五六日'.indexOf(airInfo[1].trim().replace('周', '')) + 1;
        site.time = airInfo[2].replace(':', '');
    }
    if (!data.result || !data.result.episodes) {
        this.log.e(data);
        return;
    }
    site.sort = data.result.episodes.length || site.sort;
    // eslint-disable-next-line consistent-return
    return data.result.episodes.map((ep) => ({
        site: site.site,
        sort: Number(ep.index),
        title: ep.index_title,
        url: `https://www.bilibili.com/bangumi/play/ep${ep.ep_id}`,
        time: new Date(`${ep.pub_real_time}+8`),
    }));
}
module.exports = bilibili;
/* eslint-disable no-console */
if (!module.parent) {
    (async () => {
        const site = {
            site: 'bilibili',
            id: '28224128',
        };
        console.log(await module.exports.call(require('../utils').createThis(), site));
        console.log(site);
    })();
}
