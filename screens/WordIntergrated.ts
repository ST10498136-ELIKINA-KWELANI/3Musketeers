export class WordIntergration {
    private static STOP_WORDS = new Set ([
        'a', 'an', 'the', 'in', 'on', 'near', 'by', 'and', 'or', 'is',
        'there', 'was', 'reported'
    ]);

    public static tokenize (text: string): string{
        return text 
            .toLowerCase()
            .replace (/[^a-z0-9\s]/g, '')
            .split (/\s+/)
            .filter ((word) => word.length > 2 && !this.STOP_WORDS.has(word));
        
    }

    public static calculateWordSimilarity(textA:
        string, textB: string
    ): number {
        const tokensA = new Set (this.tokenize(textA));
        const tokensB = new Set (this.tokenize(textB));

        if(tokensA.size === 0 || tokensB.size === 0)
            return 0;

        let intersectionCount = 0;
        tokensA.forEach((token) => {
            if (tokensB.has(token)) {
                intersectionCount++
            }
        });

        const unionCount = new Set ([...tokensA,
            ...tokensB]).size;
            return intersectionCount/unionCount;
    }

    public static haresHazardKey (descA: string,
        descB: string): boolean {
            const haresHazardKey = ['fire', 'smoke', 'leak',
                'spill', 'water', 'flood', 'fight', 'weapon',
                'alarm', 'crash'
            ];
            const tokensA = this.tokenize(descA);
            const tokensB = this.tokenize(descB);

            return haresHazardKey.some (
                (keyword) => tokensA.includes(keyword) && tokensB.includes(keyword)
            );
        }
}