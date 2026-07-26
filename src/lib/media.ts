export type GalleryImage = {
  id: string;
  src: string;
  srcset: string;
  avifSrcset: string;
  alt: string;
  title?: string;
  description?: string;
  width: number;
  height: number;
};

const galleryBase = '/media/gallery';

function galleryImage(
  id: string,
  width: number,
  height: number,
  alt: string,
  title?: string,
  description?: string
): GalleryImage {
  return {
    id,
    src: `${galleryBase}/${id}-960.webp`,
    srcset: `${galleryBase}/${id}-640.webp 640w, ${galleryBase}/${id}-960.webp 960w, ${galleryBase}/${id}-1440.webp 1440w`,
    avifSrcset: `${galleryBase}/${id}-640.avif 640w, ${galleryBase}/${id}-960.avif 960w, ${galleryBase}/${id}-1440.avif 1440w`,
    alt,
    title,
    description,
    width,
    height
  };
}

export const galleryImages: GalleryImage[] = [
  galleryImage('01-whale-fall', 1440, 2560, '竖幅数字插画《鲸落》。', '鲸落'),
  galleryImage('02-untitled-01', 2560, 1440, '横幅数字插画，断章图库之一。'),
  galleryImage('03-untitled-02', 1440, 2560, '竖幅数字插画，断章图库之一。'),
  galleryImage('04-rainbow-glow', 2560, 1440, '横幅数字插画《彩辉！》。', '彩辉！', '对的对的'),
  galleryImage('05-untitled-03', 2560, 1440, '横幅数字插画，断章图库之一。'),
  galleryImage('06-untitled-04', 2560, 1440, '横幅数字插画，断章图库之一。'),
  galleryImage('07-untitled-05', 2560, 1440, '横幅数字插画，断章图库之一。'),
  galleryImage('08-never-forget', 3840, 2160, '横幅数字插画《永远不会记起，也永远无法忘记之事》。', '永远不会记起 也永远无法忘记之事', '无言'),
  galleryImage('09-moonlight', 3840, 2160, '横幅数字插画《此时相望不相闻，愿逐月华流照君》。', '此时相望不相闻 愿逐月华流照君'),
  galleryImage('10-distant-neighbor', 3840, 2160, '横幅数字插画《相知无远近，万里尚为邻》。', '相知无远近 万里尚为邻'),
  galleryImage('11-year-crossing', 2560, 1440, '横幅数字插画，2025 至 2026 东方社跨年。', '无题', '2025~2026东方社跨年'),
  galleryImage('12-south-river', 2560, 1440, '横幅数字插画，题引“正是江南好风景，落花时节又逢君”。', '无题', '“正是江南好风景，落花时节又逢君。”')
];
