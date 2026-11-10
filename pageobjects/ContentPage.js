
class ContentPage {

    // Article title
    get articleTitle() {
        return $('#resource-title h1');
    }

    // Introductory paragraph
    get introParagraph() {
        return $('#resource-title p.large.mt2');
    }

    // All paragraphs in the title section
    get titleSectionParagraphs() {
        return $$('#resource-title p.base.mt2');
    }

    // Posted date and author
    get postedDateAndAuthor() {
        return $('#resource-title p.base.mt2.mb0');
    }

    // Get article title
    async getArticleTitle() {
        return await this.articleTitle.getText();
    }

    // Get introductory paragraph
    async getIntroParagraph() {
        return await this.introParagraph.getText();
    }

    // Get reading time
    async getReadingTime() {

        const paragraphs = await this.titleSectionParagraphs;

        for (const paragraph of paragraphs) {

            const text = await paragraph.getText();

            if (text.includes('Reading time:')) {
                return text;
            }
        }

        throw new Error('Reading time paragraph not found');
    }

    // Get posted date and author
    async getPostedDateAndAuthor() {
        return await this.postedDateAndAuthor.getText();
    }
    // async checkArticleTextReadable() {
    //     const title = await $('#resource-title h1');
    
    //     await title.waitForDisplayed({ timeout: 10000 });
    
    //     const actualText = await title.getText();
    
    //     console.log('Article title before cookie handling:', actualText);
    
    //     return actualText.trim().length > 0;
    // }
}

export default new ContentPage();
