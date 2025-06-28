// Copyrights C-EGG inc.
(function() {
    // 主要的和牌判定函数
    var isWinningHand = function() {
        // 判定一个 9 位的牌型是否能组成面子
        function isMeldPattern(tileBits) {
            var bits = tileBits & 7, meldCount = 0, pairCount = 0;
            if (bits === 1 || bits === 4) meldCount = pairCount = 1;
            else if (bits === 2) meldCount = pairCount = 2;
            tileBits >>= 3;
            bits = (tileBits & 7) - meldCount;
            if (bits < 0) return false;
            meldCount = pairCount;
            pairCount = 0;
            if (bits === 1 || bits === 4) { meldCount += 1; pairCount += 1; }
            else if (bits === 2) { meldCount += 2; pairCount += 2; }
            tileBits >>= 3;
            bits = (tileBits & 7) - meldCount;
            if (bits < 0) return false;
            meldCount = pairCount;
            pairCount = 0;
            if (bits === 1 || bits === 4) { meldCount += 1; pairCount += 1; }
            else if (bits === 2) { meldCount += 2; pairCount += 2; }
            tileBits >>= 3;
            bits = (tileBits & 7) - meldCount;
            if (bits < 0) return false;
            meldCount = pairCount;
            pairCount = 0;
            if (bits === 1 || bits === 4) { meldCount += 1; pairCount += 1; }
            else if (bits === 2) { meldCount += 2; pairCount += 2; }
            tileBits >>= 3;
            bits = (tileBits & 7) - meldCount;
            if (bits < 0) return false;
            meldCount = pairCount;
            pairCount = 0;
            if (bits === 1 || bits === 4) { meldCount += 1; pairCount += 1; }
            else if (bits === 2) { meldCount += 2; pairCount += 2; }
            tileBits >>= 3;
            bits = (tileBits & 7) - meldCount;
            if (bits < 0) return false;
            meldCount = pairCount;
            pairCount = 0;
            if (bits === 1 || bits === 4) { meldCount += 1; pairCount += 1; }
            else if (bits === 2) { meldCount += 2; pairCount += 2; }
            tileBits >>= 3;
            bits = (tileBits & 7) - meldCount;
            if (bits !== 0 && bits !== 3) return false;
            bits = (tileBits >> 3 & 7) - pairCount;
            return bits === 0 || bits === 3;
        }
        // 判定是否能组成雀头和面子
        function isPairAndMelds(pairType, tileBits) {
            if (pairType === 0) {
                if ((tileBits & 448) >= 128 && isMeldPattern(tileBits - 128) ||
                    (tileBits & 229376) >= 65536 && isMeldPattern(tileBits - 65536) ||
                    (tileBits & 117440512) >= 33554432 && isMeldPattern(tileBits - 33554432))
                    return true;
            } else if (pairType === 1) {
                if ((tileBits & 56) >= 16 && isMeldPattern(tileBits - 16) ||
                    (tileBits & 28672) >= 8192 && isMeldPattern(tileBits - 8192) ||
                    (tileBits & 14680064) >= 4194304 && isMeldPattern(tileBits - 4194304))
                    return true;
            } else if (pairType === 2 &&
                ((tileBits & 7) >= 2 && isMeldPattern(tileBits - 2) ||
                (tileBits & 3584) >= 1024 && isMeldPattern(tileBits - 1024) ||
                (tileBits & 1835008) >= 524288 && isMeldPattern(tileBits - 524288)))
                return true;
            return false;
        }
        // 9张牌编码为整数
        function encodeNineTiles(tiles, offset) {
            return tiles[offset + 0] << 0 | tiles[offset + 1] << 3 | tiles[offset + 2] << 6 | tiles[offset + 3] << 9 | tiles[offset + 4] << 12 | tiles[offset + 5] << 15 | tiles[offset + 6] << 18 | tiles[offset + 7] << 21 | tiles[offset + 8] << 24;
        }
        // 标准和牌判定
        function isStandardWinningHand(tileCounts) {
            // 字牌判定
            var honorBits = 1 << tileCounts[27] | 1 << tileCounts[28] | 1 << tileCounts[29] | 1 << tileCounts[30] | 1 << tileCounts[31] | 1 << tileCounts[32] | 1 << tileCounts[33];
            if (honorBits >= 16) return false;
            // 国士无双
            if ((honorBits & 3) === 2 && tileCounts[0] * tileCounts[8] * tileCounts[9] * tileCounts[17] * tileCounts[18] * tileCounts[26] * tileCounts[27] * tileCounts[28] * tileCounts[29] * tileCounts[30] * tileCounts[31] * tileCounts[32] * tileCounts[33] === 2 ||
                !(honorBits & 10) && 7 === (2 == tileCounts[0]) + (2 == tileCounts[1]) + (2 == tileCounts[2]) + (2 == tileCounts[3]) + (2 == tileCounts[4]) + (2 == tileCounts[5]) + (2 == tileCounts[6]) + (2 == tileCounts[7]) + (2 == tileCounts[8]) + (2 == tileCounts[9]) + (2 == tileCounts[10]) + (2 == tileCounts[11]) + (2 == tileCounts[12]) + (2 == tileCounts[13]) + (2 == tileCounts[14]) + (2 == tileCounts[15]) + (2 == tileCounts[16]) + (2 == tileCounts[17]) + (2 == tileCounts[18]) + (2 == tileCounts[19]) + (2 == tileCounts[20]) + (2 == tileCounts[21]) + (2 == tileCounts[22]) + (2 == tileCounts[23]) + (2 == tileCounts[24]) + (2 == tileCounts[25]) + (2 == tileCounts[26]) + (2 == tileCounts[27]) + (2 == tileCounts[28]) + (2 == tileCounts[29]) + (2 == tileCounts[30]) + (2 == tileCounts[31]) + (2 == tileCounts[32]) + (2 == tileCounts[33]))
                return true;
            if (honorBits & 2) return false;
            // 计算每一色的张数
            var manzu1 = tileCounts[0] + tileCounts[3] + tileCounts[6],
                manzu2 = tileCounts[1] + tileCounts[4] + tileCounts[7],
                pinzu1 = tileCounts[9] + tileCounts[12] + tileCounts[15],
                pinzu2 = tileCounts[10] + tileCounts[13] + tileCounts[16],
                souzu1 = tileCounts[18] + tileCounts[21] + tileCounts[24],
                souzu2 = tileCounts[19] + tileCounts[22] + tileCounts[25],
                manzuMod = (manzu1 + manzu2 + (tileCounts[2] + tileCounts[5] + tileCounts[8])) % 3;
            if (manzuMod === 1) return false;
            var pinzuMod = (pinzu1 + pinzu2 + (tileCounts[11] + tileCounts[14] + tileCounts[17])) % 3;
            if (pinzuMod === 1) return false;
            var souzuMod = (souzu1 + souzu2 + (tileCounts[20] + tileCounts[23] + tileCounts[26])) % 3;
            if (souzuMod === 1 ||
                1 !== (2 == manzuMod) + (2 == pinzuMod) + (2 == souzuMod) + (2 == tileCounts[27]) + (2 == tileCounts[28]) + (2 == tileCounts[29]) + (2 == tileCounts[30]) + (2 == tileCounts[31]) + (2 == tileCounts[32]) + (2 == tileCounts[33]))
                return false;
            manzu1 = (1 * manzu1 + 2 * manzu2) % 3;
            manzu2 = encodeNineTiles(tileCounts, 0);
            pinzu1 = (1 * pinzu1 + 2 * pinzu2) % 3;
            pinzu2 = encodeNineTiles(tileCounts, 9);
            souzu1 = (1 * souzu1 + 2 * souzu2) % 3;
            souzu2 = encodeNineTiles(tileCounts, 18);
            // 依次判定雀头和面子
            return honorBits & 4 ? !(manzuMod | manzu1 | pinzuMod | pinzu1 | souzuMod | souzu1) && isMeldPattern(manzu2) && isMeldPattern(pinzu2) && isMeldPattern(souzu2)
                : 2 == manzuMod ? !(pinzuMod | pinzu1 | souzuMod | souzu1) && isMeldPattern(pinzu2) && isMeldPattern(souzu2) && isPairAndMelds(manzu1, manzu2)
                : 2 == pinzuMod ? !(souzuMod | souzu1 | manzuMod | manzu1) && isMeldPattern(souzu2) && isMeldPattern(manzu2) && isPairAndMelds(pinzu1, pinzu2)
                : 2 == souzuMod ? !(manzuMod | manzu1 | pinzuMod | pinzu1) && isMeldPattern(manzu2) && isMeldPattern(pinzu2) && isPairAndMelds(souzu1, souzu2)
                : false;
        }
        // 入口函数，a为牌数组，b为牌数
        return function(tileCounts, tileCount) {
            if (tileCount === 34)
                return isStandardWinningHand(tileCounts);
        }
    }();
    // 牌型分解结构体
    function HandDecomposition() {
        this.pairTiles = [-1, -1, -1, -1, -1, -1, -1];
        this.melds = [
            { tile: -1, pattern: 0 },
            { tile: -1, pattern: 0 },
            { tile: -1, pattern: 0 },
            { tile: -1, pattern: 0 }
        ];
    }
    HandDecomposition.prototype = {};
    // 复杂的面子分解相关函数
    function splitMelds(hand, meldType, suitIndex, tileBits) {
        hand = hand.melds;
        var meldPattern = hand[0].pattern,
            meldResults = [0, 0, 0],
            mask = 7 << 24 - 3 * meldType,
            minMask = 2 << 24 - 3 * meldType,
            meldCount = 0;
        (tileBits & mask) >= minMask && splitMeldPattern(meldPattern, suitIndex, tileBits - minMask, meldResults) && (meldResults[0] && (hand[meldCount].tile = 9 * suitIndex + 8 - meldType, hand[meldCount].pattern = meldResults[0], ++meldCount), meldResults[1] && (hand[meldCount].tile = 9 * suitIndex + 8 - meldType, hand[meldCount].pattern = meldResults[1], ++meldCount), meldResults[2] && (hand[meldCount].tile = 9 * suitIndex + 8 - meldType, hand[meldCount].pattern = meldResults[2], ++meldCount));
        mask >>= 9;
        minMask >>= 9;
        (tileBits & mask) >= minMask && splitMeldPattern(meldPattern, suitIndex, tileBits - minMask, meldResults) && (meldResults[0] && (hand[meldCount].tile = 9 * suitIndex + 5 - meldType, hand[meldCount].pattern = meldResults[0], ++meldCount), meldResults[1] && (hand[meldCount].tile = 9 * suitIndex + 5 - meldType, hand[meldCount].pattern = meldResults[1], ++meldCount), meldResults[2] && (hand[meldCount].tile = 9 * suitIndex + 5 - meldType, hand[meldCount].pattern = meldResults[2], ++meldCount));
        minMask >>= 9;
        (tileBits & mask >> 9) >= minMask && splitMeldPattern(meldPattern, suitIndex, tileBits - minMask, meldResults) && (meldResults[0] && (hand[meldCount].tile = 9 * suitIndex + 2 - meldType, hand[meldCount].pattern = meldResults[0], ++meldCount), meldResults[1] && (hand[meldCount].tile = 9 * suitIndex + 2 - meldType, hand[meldCount].pattern = meldResults[1], ++meldCount), meldResults[2] && (hand[meldCount].tile = 9 * suitIndex + 2 - meldType, hand[meldCount].pattern = meldResults[2], ++meldCount));
        return meldCount !== 0;
    }
    // 七对和牌判定
    function isSevenPairs(hand, suitIndex, tileBits) {
        hand = hand.melds;
        var meldResults = [0, 0, 0];
        if (!splitMeldPattern(hand[0].pattern, suitIndex, tileBits, meldResults))
            return false;
        var meldCount = 0;
        meldResults[0] && (hand[meldCount].tile = hand[0].tile, hand[meldCount].pattern = meldResults[0], ++meldCount);
        meldResults[1] && (hand[meldCount].tile = hand[0].tile, hand[meldCount].pattern = meldResults[1], ++meldCount);
        meldResults[2] && (hand[meldCount].tile = hand[0].tile, hand[meldCount].pattern = meldResults[2], ++meldCount);
        return meldCount !== 0;
    }
    // 面子分解辅助
    function splitMeldPattern(meldPattern, suitIndex, tileBits, resultArr) {
        var meldIndex = -1, i, bits = tileBits & 7, meldCount = 0, pairCount = 0;
        for (i = 0; i < 7 && tileBits !== 1755; ++i) {
            switch (bits) {
                case 4:
                    meldPattern <<= 8;
                    meldPattern |= 7 * suitIndex + i + 1;
                    meldCount += 1;
                    pairCount += 1;
                case 3:
                    if ((tileBits >> 3 & 7) >= 3 + meldCount && (tileBits >> 6 & 7) >= 3 + pairCount) {
                        meldIndex = i;
                        meldCount += 3;
                        pairCount += 3;
                    } else {
                        meldPattern <<= 8;
                        meldPattern |= 21 + 9 * suitIndex + i + 1;
                    }
                    break;
                case 2:
                    meldPattern <<= 16;
                    meldPattern |= 257 * (7 * suitIndex + i + 1);
                    meldCount += 2;
                    pairCount += 2;
                    break;
                case 1:
                    meldPattern <<= 8;
                    meldPattern |= 7 * suitIndex + i + 1;
                    meldCount += 1;
                    pairCount += 1;
                    break;
                case 0:
                    break;
                default:
                    return 0;
            }
            tileBits >>= 3;
            bits = (tileBits & 7) - meldCount;
            meldCount = pairCount;
            pairCount = 0;
        }
        if (i < 7)
            return resultArr[0] = 16843009 * (21 + 9 * suitIndex + i + 1) + 66051,
                resultArr[1] = 65793 * (7 * suitIndex + i + 2) | 21 + 9 * suitIndex + i + 1 << 24,
                resultArr[2] = 65793 * (7 * suitIndex + i + 1) | 21 + 9 * suitIndex + i + 4 << 24,
                3;
        if (bits === 3)
            meldPattern = meldPattern << 8 | 9 * suitIndex + 29;
        else if (bits)
            return 0;
        bits = (tileBits >> 3 & 7) - meldCount;
        if (bits === 3)
            meldPattern = meldPattern << 8 | 9 * suitIndex + 30;
        else if (bits)
            return 0;
        if (meldIndex !== -1)
            return meldPattern <<= 24,
                resultArr[0] = meldPattern | 65793 * (21 + 9 * suitIndex + meldIndex + 1) + 258,
                resultArr[1] = meldPattern | 65793 * (7 * suitIndex + meldIndex + 1),
                resultArr[2] = 0,
                2;
        resultArr[0] = meldPattern;
        resultArr[1] = resultArr[2] = 0;
        return 1;
    }
    // 面子分解相关
    function splitSingleMeld(hand, meldType, suitIndex, tileBits) {
        var mask = 7 << 24 - 3 * meldType,
            minMask = 2 << 24 - 3 * meldType;
        if ((tileBits & mask) >= minMask && splitSingleMeldPattern(hand, suitIndex, tileBits - minMask))
            return hand.melds[0].tile = 9 * suitIndex + 8 - meldType, true;
        mask >>= 9;
        minMask >>= 9;
        if ((tileBits & mask) >= minMask && splitSingleMeldPattern(hand, suitIndex, tileBits - minMask))
            return hand.melds[0].tile = 9 * suitIndex + 5 - meldType, true;
        minMask >>= 9;
        return (tileBits & mask >> 9) >= minMask && splitSingleMeldPattern(hand, suitIndex, tileBits - minMask) ? (hand.melds[0].tile = 9 * suitIndex + 2 - meldType, true) : false;
    }
    // 面子分解
    function splitSingleMeldPattern(hand, suitIndex, tileBits) {
        var meldPattern = hand.melds[0].pattern, i, bits = tileBits & 7, meldCount = 0, pairCount = 0;
        for (i = 0; i < 7; ++i) {
            switch (bits) {
                case 4:
                    meldPattern <<= 16;
                    meldPattern |= 21 + 9 * suitIndex + i + 1 << 8 | 7 * suitIndex + i + 1;
                    meldCount += 1;
                    pairCount += 1;
                    break;
                case 3:
                    meldPattern <<= 8;
                    meldPattern |= 21 + 9 * suitIndex + i + 1;
                    break;
                case 2:
                    meldPattern <<= 16;
                    meldPattern |= 257 * (7 * suitIndex + i + 1);
                    meldCount += 2;
                    pairCount += 2;
                    break;
                case 1:
                    meldPattern <<= 8;
                    meldPattern |= 7 * suitIndex + i + 1;
                    meldCount += 1;
                    pairCount += 1;
                    break;
                case 0:
                    break;
                default:
                    return false;
            }
            tileBits >>= 3;
            bits = (tileBits & 7) - meldCount;
            meldCount = pairCount;
            pairCount = 0;
        }
        if (bits === 3)
            meldPattern = meldPattern << 8 | 9 * suitIndex + 29;
        else if (bits)
            return false;
        bits = (tileBits >> 3 & 7) - meldCount;
        if (bits === 3)
            meldPattern = meldPattern << 8 | 9 * suitIndex + 30;
        else if (bits)
            return false;
        hand.melds[0].pattern = meldPattern;
        return true;
    }
    // 和牌形分解主函数
    function decomposeWinningHand(hand, tileCounts) {
        var melds = hand.melds,
            honorBits = 1 << tileCounts[27] | 1 << tileCounts[28] | 1 << tileCounts[29] | 1 << tileCounts[30] | 1 << tileCounts[31] | 1 << tileCounts[32] | 1 << tileCounts[33];
        if (honorBits >= 16) return false;
        // 国士无双
        if ((honorBits & 3) === 2 && tileCounts[0] * tileCounts[8] * tileCounts[9] * tileCounts[17] * tileCounts[18] * tileCounts[26] * tileCounts[27] * tileCounts[28] * tileCounts[29] * tileCounts[30] * tileCounts[31] * tileCounts[32] * tileCounts[33] === 2) {
            var i, indices = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33];
            for (i = 0; i < 13 && tileCounts[indices[i]] !== 2; ++i);
            melds[0].tile = indices[i];
            melds[0].pattern = 4294967295;
            return true;
        }
        if (honorBits & 2) return false;
        var isSevenPairs = false;
        // 七对判定
        if (!(honorBits & 10) && 7 === (2 == tileCounts[0]) + (2 == tileCounts[1]) + (2 == tileCounts[2]) + (2 == tileCounts[3]) + (2 == tileCounts[4]) + (2 == tileCounts[5]) + (2 == tileCounts[6]) + (2 == tileCounts[7]) + (2 == tileCounts[8]) + (2 == tileCounts[9]) + (2 == tileCounts[10]) + (2 == tileCounts[11]) + (2 == tileCounts[12]) + (2 == tileCounts[13]) + (2 == tileCounts[14]) + (2 == tileCounts[15]) + (2 == tileCounts[16]) + (2 == tileCounts[17]) + (2 == tileCounts[18]) + (2 == tileCounts[19]) + (2 == tileCounts[20]) + (2 == tileCounts[21]) + (2 == tileCounts[22]) + (2 == tileCounts[23]) + (2 == tileCounts[24]) + (2 == tileCounts[25]) + (2 == tileCounts[26]) + (2 == tileCounts[27]) + (2 == tileCounts[28]) + (2 == tileCounts[29]) + (2 == tileCounts[30]) + (2 == tileCounts[31]) + (2 == tileCounts[32]) + (2 == tileCounts[33])) {
            melds[3].pattern = 4294967295;
            for (i = j = 0; i < 34; ++i)
                if (tileCounts[i] === 2) {
                    hand.pairTiles[j] = i;
                    j += 1;
                }
            isSevenPairs = true;
        }
        // 计算每一色的张数
        var manzu1 = tileCounts[0] + tileCounts[3] + tileCounts[6],
            manzu2 = tileCounts[1] + tileCounts[4] + tileCounts[7],
            manzu3 = tileCounts[2] + tileCounts[5] + tileCounts[8],
            pinzu1 = tileCounts[9] + tileCounts[12] + tileCounts[15],
            pinzu2 = tileCounts[10] + tileCounts[13] + tileCounts[16],
            pinzu3 = tileCounts[11] + tileCounts[14] + tileCounts[17],
            souzu1 = tileCounts[18] + tileCounts[21] + tileCounts[24],
            souzu2 = tileCounts[19] + tileCounts[22] + tileCounts[25],
            souzu3 = tileCounts[20] + tileCounts[23] + tileCounts[26];
        var manzuMod = (manzu1 + manzu2 + manzu3) % 3;
        if (manzuMod === 1) return isSevenPairs;
        var pinzuMod = (pinzu1 + pinzu2 + pinzu3) % 3;
        if (pinzuMod === 1) return isSevenPairs;
        var souzuMod = (souzu1 + souzu2 + souzu3) % 3;
        if (souzuMod === 1 ||
            1 !== (2 == manzuMod) + (2 == pinzuMod) + (2 == souzuMod) + (2 == tileCounts[27]) + (2 == tileCounts[28]) + (2 == tileCounts[29]) + (2 == tileCounts[30]) + (2 == tileCounts[31]) + (2 == tileCounts[32]) + (2 == tileCounts[33]))
            return isSevenPairs;
        // 字牌暗刻处理
        honorBits & 8 && (tileCounts[27] === 3 && (melds[0].pattern <<= 8, melds[0].pattern |= 49),
            tileCounts[28] === 3 && (melds[0].pattern <<= 8, melds[0].pattern |= 50),
            tileCounts[29] === 3 && (melds[0].pattern <<= 8, melds[0].pattern |= 51),
            tileCounts[30] === 3 && (melds[0].pattern <<= 8, melds[0].pattern |= 52),
            tileCounts[31] === 3 && (melds[0].pattern <<= 8, melds[0].pattern |= 53),
            tileCounts[32] === 3 && (melds[0].pattern <<= 8, melds[0].pattern |= 54),
            tileCounts[33] === 3 && (melds[0].pattern <<= 8, melds[0].pattern |= 55));
        manzu3 = manzu1 + manzu2 + manzu3;
        manzu1 = (1 * manzu1 + 2 * manzu2) % 3;
        manzu2 = encodeNineTiles(tileCounts, 0);
        pinzu3 = pinzu1 + pinzu2 + pinzu3;
        pinzu1 = (1 * pinzu1 + 2 * pinzu2) % 3;
        pinzu2 = encodeNineTiles(tileCounts, 9);
        souzu3 = souzu1 + souzu2 + souzu3;
        souzu1 = (1 * souzu1 + 2 * souzu2) % 3;
        souzu2 = encodeNineTiles(tileCounts, 18);
        // 依次判定雀头和面子
        if (honorBits & 4) {
            if (manzuMod | manzu1 | pinzuMod | pinzu1 | souzuMod | souzu1)
                return isSevenPairs;
            tileCounts[27] === 2 ? melds[0].tile = 27 : tileCounts[28] === 2 ? melds[0].tile = 28 : tileCounts[29] === 2 ? melds[0].tile = 29 : tileCounts[30] === 2 ? melds[0].tile = 30 : tileCounts[31] === 2 ? melds[0].tile = 31 : tileCounts[32] === 2 ? melds[0].tile = 32 : tileCounts[33] === 2 && (melds[0].tile = 33);
            if (manzu3 >= 9) {
                if (splitSingleMeldPattern(hand, 1, pinzu2) && splitSingleMeldPattern(hand, 2, souzu2) && isSevenPairs(hand, 0, manzu2))
                    return true;
            } else if (pinzu3 >= 9) {
                if (splitSingleMeldPattern(hand, 2, souzu2) && splitSingleMeldPattern(hand, 0, manzu2) && isSevenPairs(hand, 1, pinzu2))
                    return true;
            } else if (souzu3 >= 9) {
                if (splitSingleMeldPattern(hand, 0, manzu2) && splitSingleMeldPattern(hand, 1, pinzu2) && isSevenPairs(hand, 2, souzu2))
                    return true;
            } else if (splitSingleMeldPattern(hand, 0, manzu2) && splitSingleMeldPattern(hand, 1, pinzu2) && splitSingleMeldPattern(hand, 2, souzu2))
                return true;
        } else if (manzuMod === 2) {
            if (pinzuMod | pinzu1 | souzuMod | souzu1)
                return isSevenPairs;
            if (manzu3 >= 8) {
                if (splitSingleMeldPattern(hand, 1, pinzu2) && splitSingleMeldPattern(hand, 2, souzu2) && splitMelds(hand, manzu1, 0, manzu2))
                    return true;
            } else if (pinzu3 >= 9) {
                if (splitSingleMeldPattern(hand, 2, souzu2) && splitSingleMeld(hand, manzu1, 0, manzu2) && isSevenPairs(hand, 1, pinzu2))
                    return true;
            } else if (souzu3 >= 9) {
                if (splitSingleMeld(hand, manzu1, 0, manzu2) && splitSingleMeldPattern(hand, 1, pinzu2) && isSevenPairs(hand, 2, souzu2))
                    return true;
            } else if (splitSingleMeldPattern(hand, 1, pinzu2) && splitSingleMeldPattern(hand, 2, souzu2) && splitSingleMeld(hand, manzu1, 0, manzu2))
                return true;
        } else if (pinzuMod === 2) {
            if (souzuMod | souzu1 | manzuMod | manzu1)
                return isSevenPairs;
            if (pinzu3 >= 8) {
                if (splitSingleMeldPattern(hand, 2, souzu2) && splitSingleMeldPattern(hand, 0, manzu2) && splitMelds(hand, pinzu1, 1, pinzu2))
                    return true;
            } else if (souzu3 >= 9) {
                if (splitSingleMeldPattern(hand, 0, manzu2) && splitSingleMeld(hand, pinzu1, 1, pinzu2) && isSevenPairs(hand, 2, souzu2))
                    return true;
            } else if (manzu3 >= 9) {
                if (splitSingleMeld(hand, pinzu1, 1, pinzu2) && splitSingleMeldPattern(hand, 2, souzu2) && isSevenPairs(hand, 0, manzu2))
                    return true;
            } else if (splitSingleMeldPattern(hand, 2, souzu2) && splitSingleMeldPattern(hand, 0, manzu2) && splitSingleMeld(hand, pinzu1, 1, pinzu2))
                return true;
        } else if (souzuMod === 2) {
            if (manzuMod | manzu1 | pinzuMod | pinzu1)
                return isSevenPairs;
            if (souzu3 >= 8) {
                if (splitSingleMeldPattern(hand, 0, manzu2) && splitSingleMeldPattern(hand, 1, pinzu2) && splitMelds(hand, souzu1, 2, souzu2))
                    return true;
            } else if (manzu3 >= 9) {
                if (splitSingleMeldPattern(hand, 1, pinzu2) && splitSingleMeld(hand, souzu1, 2, souzu2) && isSevenPairs(hand, 0, manzu2))
                    return true;
            } else if (pinzu3 >= 9) {
                if (splitSingleMeld(hand, souzu1, 2, souzu2) && splitSingleMeldPattern(hand, 0, manzu2) && isSevenPairs(hand, 1, pinzu2))
                    return true;
            } else if (splitSingleMeldPattern(hand, 0, manzu2) && splitSingleMeldPattern(hand, 1, pinzu2) && splitSingleMeld(hand, souzu1, 2, souzu2))
                return true;
        }
        melds[0].pattern = 0;
        return isSevenPairs;
    }
    // 9张牌编码为整数
    function encodeNineTilesSimple(tiles, offset) {
        return tiles[offset + 0] << 0 | tiles[offset + 1] << 3 | tiles[offset + 2] << 6 | tiles[offset + 3] << 9 | tiles[offset + 4] << 12 | tiles[offset + 5] << 15 | tiles[offset + 6] << 18 | tiles[offset + 7] << 21 | tiles[offset + 8] << 24;
    }
    // 下面是向听数计算相关
    var ShantenCalculator = function() {
        // 刻子操作
        function addTriplet(index) { tileCounts[index] -= 2; ++tripletCount; }
        function removeTriplet(index) { tileCounts[index] += 2; --tripletCount; }
        // 顺子操作
        function addSequence(index) { --tileCounts[index]; --tileCounts[index + 1]; --tileCounts[index + 2]; ++sequenceCount; }
        function removeSequence(index) { ++tileCounts[index]; ++tileCounts[index + 1]; ++tileCounts[index + 2]; --sequenceCount; }
        // 两面搭子
        function addRyanmen(index) { --tileCounts[index]; --tileCounts[index + 1]; ++pairCount; }
        function removeRyanmen(index) { ++tileCounts[index]; ++tileCounts[index + 1]; --pairCount; }
        // 边张搭子
        function addPenchan(index) { --tileCounts[index]; --tileCounts[index + 2]; ++pairCount; }
        function removePenchan(index) { ++tileCounts[index]; ++tileCounts[index + 2]; --pairCount; }
        var recursionDepth = 0, tileCounts, sequenceCount = 0, pairCount = 0, tripletCount = 0, isolatedCount = 0, honorTripletMask = 0, honorPairMask = 0;
        return {
            minShanten: 8, // 最小向听数
            // 计算当前组合的向听数
            updateShanten: function() {
                var shanten = 8 - 2 * sequenceCount - pairCount - tripletCount,
                    melds = sequenceCount + pairCount;
                tripletCount ? melds += tripletCount - 1 : honorTripletMask && honorPairMask && (honorTripletMask | honorPairMask) == honorTripletMask && ++shanten;
                if (melds > 4) shanten += melds - 4;
                if (shanten !== -1 && shanten < isolatedCount) shanten = isolatedCount;
                if (shanten < this.minShanten) this.minShanten = shanten;
            },
            // 初始化计数
            init: function(tiles, count) {
                tileCounts = Array(34).fill(0);
                honorPairMask = honorTripletMask = isolatedCount = tripletCount = pairCount = sequenceCount = 0;
                this.minShanten = 8;
                if (count === 136)
                    for (var i = 0; i < 136; ++i)
                        tiles[i] && ++tileCounts[i >> 2];
                else if (count === 34)
                    for (var i = 0; i < 34; ++i)
                        tileCounts[i] = tiles[i];
                else
                    for (--count; count >= 0; --count)
                        ++tileCounts[tiles[count] >> 2];
            },
            // 统计手牌张数
            countTiles: function() {
                return tileCounts.reduce((sum, v) => sum + v, 0);
            },
            // 国士/七对向听数
            calcKokushiChitoiShanten: function() {
                var kokushiPairs = (tileCounts[0] >= 2) + (tileCounts[8] >= 2) + (tileCounts[9] >= 2) + (tileCounts[17] >= 2) + (tileCounts[18] >= 2) + (tileCounts[26] >= 2) + (tileCounts[27] >= 2) + (tileCounts[28] >= 2) + (tileCounts[29] >= 2) + (tileCounts[30] >= 2) + (tileCounts[31] >= 2) + (tileCounts[32] >= 2) + (tileCounts[33] >= 2),
                    kokushiUnique = (tileCounts[0] !== 0) + (tileCounts[8] !== 0) + (tileCounts[9] !== 0) + (tileCounts[17] !== 0) + (tileCounts[18] !== 0) + (tileCounts[26] !== 0) + (tileCounts[27] !== 0) + (tileCounts[28] !== 0) + (tileCounts[29] !== 0) + (tileCounts[30] !== 0) + (tileCounts[31] !== 0) + (tileCounts[32] !== 0) + (tileCounts[33] !== 0),
                    allUnique = kokushiUnique + (tileCounts[1] !== 0) + (tileCounts[2] !== 0) + (tileCounts[3] !== 0) + (tileCounts[4] !== 0) + (tileCounts[5] !== 0) + (tileCounts[6] !== 0) + (tileCounts[7] !== 0) + (tileCounts[10] !== 0) + (tileCounts[11] !== 0) + (tileCounts[12] !== 0) + (tileCounts[13] !== 0) + (tileCounts[14] !== 0) + (tileCounts[15] !== 0) + (tileCounts[16] !== 0) + (tileCounts[19] !== 0) + (tileCounts[20] !== 0) + (tileCounts[21] !== 0) + (tileCounts[22] !== 0) + (tileCounts[23] !== 0) + (tileCounts[24] !== 0) + (tileCounts[25] !== 0),
                    minShanten = this.minShanten,
                    shanten = 6 - (kokushiPairs + (tileCounts[1] >= 2) + (tileCounts[2] >= 2) + (tileCounts[3] >= 2) + (tileCounts[4] >= 2) + (tileCounts[5] >= 2) + (tileCounts[6] >= 2) + (tileCounts[7] >= 2) + (tileCounts[10] >= 2) + (tileCounts[11] >= 2) + (tileCounts[12] >= 2) + (tileCounts[13] >= 2) + (tileCounts[14] >= 2) + (tileCounts[15] >= 2) + (tileCounts[16] >= 2) + (tileCounts[19] >= 2) + (tileCounts[20] >= 2) + (tileCounts[21] >= 2) + (tileCounts[22] >= 2) + (tileCounts[23] >= 2) + (tileCounts[24] >= 2) + (tileCounts[25] >= 2)) + (7 > allUnique ? 7 - allUnique : 0);
                if (shanten < minShanten) minShanten = shanten;
                shanten = 13 - kokushiUnique - (kokushiPairs ? 1 : 0);
                if (shanten < minShanten) minShanten = shanten;
                return minShanten;
            },
            // 字牌刻子搭子统计
            countHonorMelds: function(tileCount) {
                var tripletMask = 0, pairMask = 0, i;
                for (i = 27; i < 34; ++i)
                    switch (tileCounts[i]) {
                        case 4: ++sequenceCount; tripletMask |= 1 << i - 27; pairMask |= 1 << i - 27; ++isolatedCount; break;
                        case 3: ++sequenceCount; break;
                        case 2: ++tripletCount; break;
                        case 1: pairMask |= 1 << i - 27;
                    }
                isolatedCount && tileCount % 3 === 2 && --isolatedCount;
                pairMask && (honorPairMask |= 134217728, (tripletMask | pairMask) == tripletMask && (honorTripletMask |= 134217728));
            },
            // 幺九刻子搭子统计
            countTerminalMelds: function(tileCount) {
                var tripletMask = 0, pairMask = 0, i;
                for (i = 27; i < 34; ++i)
                    switch (tileCounts[i]) {
                        case 4: ++sequenceCount; tripletMask |= 1 << i - 18; pairMask |= 1 << i - 18; ++isolatedCount; break;
                        case 3: ++sequenceCount; break;
                        case 2: ++tripletCount; break;
                        case 1: pairMask |= 1 << i - 18;
                    }
                for (i = 0; i < 9; i += 8)
                    switch (tileCounts[i]) {
                        case 4: ++sequenceCount; tripletMask |= 1 << i; pairMask |= 1 << i; ++isolatedCount; break;
                        case 3: ++sequenceCount; break;
                        case 2: ++tripletCount; break;
                        case 1: pairMask |= 1 << i;
                    }
                isolatedCount && tileCount % 3 === 2 && --isolatedCount;
                pairMask && (honorPairMask |= 134217728, (tripletMask | pairMask) == tripletMask && (honorTripletMask |= 134217728));
            },
            // 递归分解主函数
            splitAll: function(additionalTriplets) {
                honorTripletMask |= (tileCounts[0] === 4) << 0 | (tileCounts[1] === 4) << 1 | (tileCounts[2] === 4) << 2 | (tileCounts[3] === 4) << 3 | (tileCounts[4] === 4) << 4 | (tileCounts[5] === 4) << 5 | (tileCounts[6] === 4) << 6 | (tileCounts[7] === 4) << 7 | (tileCounts[8] === 4) << 8 | (tileCounts[9] === 4) << 9 | (tileCounts[10] === 4) << 10 | (tileCounts[11] === 4) << 11 | (tileCounts[12] === 4) << 12 | (tileCounts[13] === 4) << 13 | (tileCounts[14] === 4) << 14 | (tileCounts[15] === 4) << 15 | (tileCounts[16] === 4) << 16 | (tileCounts[17] === 4) << 17 | (tileCounts[18] === 4) << 18 | (tileCounts[19] === 4) << 19 | (tileCounts[20] === 4) << 20 | (tileCounts[21] === 4) << 21 | (tileCounts[22] === 4) << 22 | (tileCounts[23] === 4) << 23 | (tileCounts[24] === 4) << 24 | (tileCounts[25] === 4) << 25 | (tileCounts[26] === 4) << 26;
                sequenceCount += additionalTriplets;
                this.splitRecursive(0);
            },
            // 递归分解
            splitRecursive: function(startIndex) {
                var self = this.splitRecursive;
                ++recursionDepth;
                if (this.minShanten !== -1) {
                    while (startIndex < 27 && !tileCounts[startIndex]) ++startIndex;
                    if (startIndex === 27) return this.updateShanten();
                    var suitIndex = startIndex;
                    if (suitIndex > 8) suitIndex -= 9;
                    if (suitIndex > 8) suitIndex -= 9;
                    switch (tileCounts[startIndex]) {
                        case 4:
                            tileCounts[startIndex] -= 3;
                            ++sequenceCount;
                            if (suitIndex < 7 && tileCounts[startIndex + 2] && tileCounts[startIndex + 1]) {
                                addSequence(startIndex);
                                self.call(this, startIndex + 1);
                                removeSequence(startIndex);
                            }
                            if (suitIndex < 7 && tileCounts[startIndex + 2]) {
                                addPenchan(startIndex);
                                self.call(this, startIndex + 1);
                                removePenchan(startIndex);
                            }
                            if (suitIndex < 8 && tileCounts[startIndex + 1]) {
                                addRyanmen(startIndex);
                                self.call(this, startIndex + 1);
                                removeRyanmen(startIndex);
                            }
                            var idx = startIndex;
                            --tileCounts[idx];
                            honorPairMask |= 1 << idx;
                            self.call(this, startIndex + 1);
                            idx = startIndex;
                            ++tileCounts[idx];
                            honorPairMask &= ~(1 << idx);
                            tileCounts[startIndex] += 3;
                            --sequenceCount;
                            addTriplet(startIndex);
                            if (suitIndex < 7 && tileCounts[startIndex + 2] && tileCounts[startIndex + 1]) {
                                addSequence(startIndex);
                                self.call(this, startIndex);
                                removeSequence(startIndex);
                            }
                            if (suitIndex < 7 && tileCounts[startIndex + 2]) {
                                addPenchan(startIndex);
                                self.call(this, startIndex + 1);
                                removePenchan(startIndex);
                            }
                            if (suitIndex < 8 && tileCounts[startIndex + 1]) {
                                addRyanmen(startIndex);
                                self.call(this, startIndex + 1);
                                removeRyanmen(startIndex);
                            }
                            removeTriplet(startIndex);
                            break;
                        case 3:
                            tileCounts[startIndex] -= 3;
                            ++sequenceCount;
                            self.call(this, startIndex + 1);
                            tileCounts[startIndex] += 3;
                            --sequenceCount;
                            addTriplet(startIndex);
                            if (suitIndex < 7 && tileCounts[startIndex + 2] && tileCounts[startIndex + 1]) {
                                addSequence(startIndex);
                                self.call(this, startIndex + 1);
                                removeSequence(startIndex);
                            } else {
                                if (suitIndex < 7 && tileCounts[startIndex + 2]) {
                                    addPenchan(startIndex);
                                    self.call(this, startIndex + 1);
                                    removePenchan(startIndex);
                                }
                                if (suitIndex < 8 && tileCounts[startIndex + 1]) {
                                    addRyanmen(startIndex);
                                    self.call(this, startIndex + 1);
                                    removeRyanmen(startIndex);
                                }
                            }
                            removeTriplet(startIndex);
                            if (suitIndex < 7 && tileCounts[startIndex + 2] >= 2 && tileCounts[startIndex + 1] >= 2) {
                                addSequence(startIndex);
                                addSequence(startIndex);
                                self.call(this, startIndex);
                                removeSequence(startIndex);
                                removeSequence(startIndex);
                            }
                            break;
                        case 2:
                            addTriplet(startIndex);
                            self.call(this, startIndex + 1);
                            removeTriplet(startIndex);
                            if (suitIndex < 7 && tileCounts[startIndex + 2] && tileCounts[startIndex + 1]) {
                                addSequence(startIndex);
                                self.call(this, startIndex);
                                removeSequence(startIndex);
                            }
                            break;
                        case 1:
                            if (suitIndex < 6 && tileCounts[startIndex + 1] === 1 && tileCounts[startIndex + 2] && tileCounts[startIndex + 3] !== 4) {
                                addSequence(startIndex);
                                self.call(this, startIndex + 2);
                                removeSequence(startIndex);
                            } else {
                                var idx = startIndex;
                                --tileCounts[idx];
                                honorPairMask |= 1 << idx;
                                self.call(this, startIndex + 1);
                                idx = startIndex;
                                ++tileCounts[idx];
                                honorPairMask &= ~(1 << idx);
                                if (suitIndex < 7 && tileCounts[startIndex + 2]) {
                                    if (tileCounts[startIndex + 1]) {
                                        addSequence(startIndex);
                                        self.call(this, startIndex + 1);
                                        removeSequence(startIndex);
                                    }
                                    addPenchan(startIndex);
                                    self.call(this, startIndex + 1);
                                    removePenchan(startIndex);
                                }
                                if (suitIndex < 8 && tileCounts[startIndex + 1]) {
                                    addRyanmen(startIndex);
                                    self.call(this, startIndex + 1);
                                    removeRyanmen(startIndex);
                                }
                            }
                    }
                }
            }
        }
    }();
    // 标准形向听数计算
    function calcStandardShanten(tileCounts, isPinfu) {
        ShantenCalculator.init(tileCounts, 34);
        var tileNum = ShantenCalculator.countTiles();
        if (tileNum > 14) return -2;
        !isPinfu && tileNum >= 13 && (ShantenCalculator.minShanten = ShantenCalculator.calcKokushiChitoiShanten(tileNum));
        ShantenCalculator.countHonorMelds(tileNum);
        ShantenCalculator.splitAll(Math.floor((14 - tileNum) / 3));
        return ShantenCalculator.minShanten;
    }
    // 返回标准形和一般形向听数
    function calcShantenBoth(tileCounts, tileCount) {
        ShantenCalculator.init(tileCounts, tileCount);
        var tileNum = ShantenCalculator.countTiles();
        if (!(tileNum > 14)) {
            var shantenArr = [ShantenCalculator.minShanten, ShantenCalculator.minShanten];
            tileNum >= 13 && (shantenArr[0] = ShantenCalculator.calcKokushiChitoiShanten(tileNum));
            ShantenCalculator.countHonorMelds(tileNum);
            ShantenCalculator.splitAll(Math.floor((14 - tileNum) / 3));
            shantenArr[1] = ShantenCalculator.minShanten;
            shantenArr[1] < shantenArr[0] && (shantenArr[0] = shantenArr[1]);
            return shantenArr;
        }
    }
    // 牌号转字符串
    function tileIndexToString(tileIndex) {
        var idx = tileIndex >> 2;
        return (idx < 27 && tileIndex % 36 === 16 ? "0" : idx % 9 + 1) + "mpsz".substr(idx / 9, 1);
    }
    // 牌字符串标准化
    function normalizeTileString(str) {
        return str.replace(/\d(m|p|s|z)(\d\1)*/g, "$&:").replace(/(m|p|s|z)([^:])/g, "$2").replace(/:/g, "");
    }
    // 牌字符串转136数组
    function tileStringTo136Array(str) {
        str = str.replace(/(\d)m/g, "0$1").replace(/(\d)p/g, "1$1").replace(/(\d)s/g, "2$1").replace(/(\d)z/g, "3$1");
        var i, arr = Array(136);
        for (i = 0; i < str.length; i += 2) {
            var d = str.substr(i, 2), idx;
            d % 10 ? (idx = 4 * (9 * Math.floor(d / 10) + (d % 10 - 1)), idx = arr[idx + 3] ? arr[idx + 2] ? arr[idx + 1] ? idx : idx + 1 : idx + 2 : idx + 3) : idx = 4 * (9 * d / 10 + 4) + 0;
            arr[idx] && document.write("err n=" + d + " k=" + idx + "<br>");
            arr[idx] = 1;
        }
        return arr;
    }
    // 牌字符串转34索引
    function tileStringTo34Index(str) {
        var num = parseInt(str.substr(0, 1));
        return (num ? num - 1 : 4) + 9 * "mpsz".indexOf(str.substr(1, 1));
    }
    // 求听牌
    function getTingTiles(tileCounts) {
        var i, result = [];
        for (i = 0; i < 34; ++i)
            if (tileCounts[i] < 4) {
                tileCounts[i]++;
                isWinningHand(tileCounts, 34) && result.push(i);
                tileCounts[i]--;
            }
        return result;
    }
    // 136数组转34数组
    function array136To34(arr) {
        var i, result = Array(34).fill(0);
        for (i = 0; i < 136; ++i)
            arr[i] && ++result[i >> 2];
        return result;
    }
    // 生成超链接
    function createLink(tile, attr, mode, query, tileIndex, shanten) {
        return '<a href="?' + mode + "=" + query + '" class=D onmouseover="daFocus(this,' + tileIndex + "," + shanten + ');" onmouseout="daUnfocus();" >' + createTileImg(tile, attr) + "</a>";
    }
    // 生成图片标签
    function createTileImg(tile, attr) {
        return '<img src="https://cdn.tenhou.net/2/t/' + tile + '.gif" border=0 ' + (attr ? attr : "") + " />";
    }
    // 向听数描述
    function shantenDescription(shanten) {
        return shanten === -1 ? "和了" : shanten === 0 ? "听牌" : shanten + "向听";
    }
    // 标准形/一般形描述
    function shantenTypeDescription(shantenArr, isFullHand) {
        return isFullHand && shantenArr[0] !== shantenArr[1] ? "标准形" + shantenDescription(shantenArr[0]) + " / 一般形" + shantenDescription(shantenArr[1]) : shantenDescription(shantenArr[0]);
    }
    // 和牌形展示
    function showWinningHandShape(tileCounts) {
        function meldToString(meld) {
            meld &= 127;
            return meld < 21 ? (meld = 9 * Math.floor(meld / 7) + meld % 7, createTileImg(tileIndexToString(4 * meld + 1)) + createTileImg(tileIndexToString(4 * meld + 5)) + createTileImg(tileIndexToString(4 * meld + 9)))
                : meld < 55 ? (meld = createTileImg(tileIndexToString(4 * (meld - 21) + 1)), meld + meld + meld)
                : meld < 89 ? (meld = createTileImg(tileIndexToString(4 * (meld - 55) + 1)), meld + meld + meld + meld)
                : "";
        }
        function pairToString(tile) {
            tile = createTileImg(tileIndexToString(4 * tile + 1));
            return tile + tile;
        }
        var hand = new HandDecomposition;
        if (decomposeWinningHand(hand, tileCounts)) {
            var result = "";
            for (var i = 0; i < 4; ++i)
                if (hand.melds[i].pattern) {
                    if (i === 0 && hand.melds[0].pattern === 4294967295) {
                        result += "国士形和了 ";
                        result += pairToString(hand.melds[i].tile) + " ";
                        var indices = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33];
                        for (var j = 0; j < 13; ++j)
                            hand.melds[i].tile !== indices[j] && (result += createTileImg(tileIndexToString(4 * indices[j] + 1)));
                    } else if (i === 3 && hand.melds[3].pattern === 4294967295) {
                        result += "七对形和了 ";
                        result += pairToString(hand.pairTiles[0]) + " " + pairToString(hand.pairTiles[1]) + " " + pairToString(hand.pairTiles[2]) + " " + pairToString(hand.pairTiles[3]) + " " + pairToString(hand.pairTiles[4]) + " " + pairToString(hand.pairTiles[5]) + " " + pairToString(hand.pairTiles[6]);
                    } else {
                        var meldArr = [
                            (hand.melds[i].pattern >> 0 & 255) - 1,
                            (hand.melds[i].pattern >> 8 & 255) - 1,
                            (hand.melds[i].pattern >> 16 & 255) - 1,
                            (hand.melds[i].pattern >> 24 & 255) - 1
                        ];
                        result += "一般形和了 ";
                        result += pairToString(hand.melds[i].tile) + " " + meldToString(meldArr[3]) + " " + meldToString(meldArr[2]) + " " + meldToString(meldArr[1]) + " " + meldToString(meldArr[0]);
                    }
                    result += "<br>";
                }
            return result;
        }
    }
    // 主入口，页面初始化和交互
    function main() {
        function countWaitTiles(waitTiles, tileCounts) {
            var i, count = 0;
            for (i = 0; i < waitTiles.length; ++i)
                count += 4 - tileCounts[waitTiles[i]];
            return count;
        }
        var queryType = urlQueryType, tileString = urlTileString, output;
        output = "<hr size=1 color=#CCCCCC >";
        switch (queryType.substr(0, 1)) {
            case "q":
                output += '标准形(包含七对国士)的计算结果 / <a href="?p' + queryType.substr(1) + "=" + tileString + '">一般形</a><br>';
                break;
            case "p":
                output += '一般形(不包含七对国士)的计算结果 / <a href="?q' + queryType.substr(1) + "=" + tileString + '">标准形</a><br>';
        }
        for (var isDraw = queryType.substr(1, 1) === "d", mode = queryType.substr(0, 1), tileString = tileString.replace(/(\d)(\d{0,8})(\d{0,8})(\d{0,8})(\d{0,8})(\d{0,8})(\d{0,8})(\d{8})(m|p|s|z)/g, "$1$9$2$9$3$9$4$9$5$9$6$9$7$9$8$9").replace(/(\d?)(\d?)(\d?)(\d?)(\d?)(\d?)(\d)(\d)(m|p|s|z)/g, "$1$9$2$9$3$9$4$9$5$9$6$9$7$9$8$9").replace(/(m|p|s|z)(m|p|s|z)+/g, "$1").replace(/^[^\d]/, ""), tileString = tileString.substr(0, 28), tileArr = tileStringTo136Array(tileString), randIdx = -1; randIdx = Math.floor(136 * Math.random()), tileArr[randIdx];);
        var mod = Math.floor(tileString.length / 2) % 3;
        if (mod === 2 || isDraw || (tileArr[randIdx] = 1, tileString += tileIndexToString(randIdx)));
        var tileCounts = array136To34(tileArr),
            handHtml = "",
            shantenArr = calcShantenBoth(tileCounts, 34),
            handHtml = handHtml + shantenTypeDescription(shantenArr, tileString.length === 28),
            handHtml = handHtml + ("(" + Math.floor(tileString.length / 2) + "枚)");
        if (shantenArr[0] === -1) handHtml += ' / <a href="?" >新しい手牌を作成</a>';
        var handHtml = handHtml + "<br/>", shanten = mode === "q" ? shantenArr[0] : shantenArr[1], i, j, discardOptions = Array(35);
        if (shanten === 0 && mod === 1 && isDraw)
            i = 34, discardOptions[i] = getTingTiles(tileCounts), discardOptions[i].length && (discardOptions[i] = { i: i, n: countWaitTiles(discardOptions[i], tileCounts), c: discardOptions[i] });
        else if (shanten <= 0)
            for (i = 0; i < 34; ++i)
                tileCounts[i] && (tileCounts[i]--, discardOptions[i] = getTingTiles(tileCounts), tileCounts[i]++, discardOptions[i].length && (discardOptions[i] = { i: i, n: countWaitTiles(discardOptions[i], tileCounts), c: discardOptions[i] }));
        else if (mod === 2 || (mod === 1 && !isDraw))
            for (i = 0; i < 34; ++i) {
                if (tileCounts[i]) {
                    tileCounts[i]--;
                    discardOptions[i] = [];
                    for (j = 0; j < 34; ++j)
                        i === j || tileCounts[j] >= 4 || (tileCounts[j]++, calcStandardShanten(tileCounts, mode === "p") === shanten - 1 && discardOptions[i].push(j), tileCounts[j]--);
                    tileCounts[i]++;
                    discardOptions[i].length && (discardOptions[i] = { i: i, n: countWaitTiles(discardOptions[i], tileCounts), c: discardOptions[i] });
                }
            }
        else {
            i = 34;
            discardOptions[i] = [];
            for (j = 0; j < 34; ++j)
                tileCounts[j] >= 4 || (tileCounts[j]++, calcStandardShanten(tileCounts, mode === "p") === shanten - 1 && discardOptions[i].push(j), tileCounts[j]--);
            discardOptions[i].length && (discardOptions[i] = { i: i, n: countWaitTiles(discardOptions[i], tileCounts), c: discardOptions[i] });
        }
        var discardList = [];
        for (i = 0; i < tileString.length; i += 2) {
            j = tileString.substr(i, 2);
            var tileIdx = tileStringTo34Index(j),
                normalized = normalizeTileString(tileString.replace(j, "").replace(/(\d)(m|p|s|z)/g, "$2$1$1,").replace(/00/g, "50").split(",").sort().join("").replace(/(m|p|s|z)\d(\d)/g, "$2$1")),
                nextShanten = shanten + 1,
                discardOption = discardOptions[tileIdx];
            discardOption && discardOption.n && (nextShanten = shanten === -1 ? 0 : shanten, discardOption.q === undefined && discardList.push(discardOption), discardOption.q = normalized);
            if (mod === 2) normalized += tileIndexToString(randIdx);
            handHtml += (mod === 2 || (mod !== 2 && !isDraw) ? createLink : createTileImg)(j, i % 3 === 2 && i === tileString.length - 2 ? " hspace=3 " : "", mode, normalized, tileIdx, nextShanten);
        }
        discardOptions[34] && discardOptions[34].n && (discardOptions[34].q = normalizeTileString(tileString), discardList.push(discardOptions[34]), handHtml += '<br><br><a href="?' + mode + "=" + discardOptions[34].q + '">次のツモをランダムに追加</a>');
        discardList.sort(function(a, b) { return b.n - a.n; });
        var outputText = "" + (document.f.q.value + "\n");
        output += "<table cellpadding=2 cellspacing=0 >";
        var actionLabel = shanten <= 0 ? "待ち" : "摸";
        for (i = 0; i < discardList.length; ++i) {
            var tileIdx = discardList[i].i;
            output += "<tr id=mda" + tileIdx + " ><td>";
            if (tileIdx < 34) {
                output += "打</td><td>" + ('<img src="https://cdn.tenhou.net/2/a/' + tileIndexToString(4 * tileIdx + 1) + '.gif" class=D />') + "</td><td>";
                outputText += "打" + tileIndexToString(4 * tileIdx + 1) + " ";
            }
            output += actionLabel + "[</td><td>";
            outputText += actionLabel + "[";
            var waits = discardList[i].c,
                normalized = discardList[i].q;
            for (j = 0; j < waits.length; ++j) {
                var tileStr = tileIndexToString(4 * waits[j] + 1);
                output += '<a href="?' + mode + "=" + (normalized + tileStr) + '" class=D onmouseover="daFocus(this,' + tileIdx + ');" onmouseout="daUnfocus();"><img src="https://cdn.tenhou.net/2/a/' + tileStr + '.gif" border=0 /></a>';
                outputText += tileIndexToString(4 * waits[j] + 1);
            }
            output += "</td><td>" + discardList[i].n + "枚</td><td>]</td></tr>";
            outputText += " " + discardList[i].n + "枚]\n";
        }
        output += "</table><br><hr><br>" + ('<textarea rows=10 style="width:100%;font-size:75%;">' + outputText + "</textarea>");
        if (shantenArr[0] === -1) output += "<hr size=1 color=#CCCCCC >" + showWinningHandShape(tileCounts);
        document.getElementById("tehai").innerHTML = handHtml;
        document.getElementById("tips").innerHTML = "";
        document.getElementById("m2").innerHTML = output + "<br>";
    }
    // 页面初始化
    document.write('<form name=f style="margin:0px;" > 手牌 <input type=text name=q size=20 ><input type=submit value=" OK "><hr size=1 color=#CCCCCC ></form><div id=tehai align=center ></div><div id=tips align=center style="height:18px"></div><div id=m2 align=center ></div>');
    var urlTileString = window.location.search.substr(1),
        urlTileString = urlTileString.replace(/^([^=]+)=(.+)/, "$2"),
        urlQueryType = RegExp.$1;
    document.f.q.value = urlTileString;
    if (urlTileString.length)
        null == urlTileString.match(/^(\d+m|\d+p|\d+s|[1234567]+z)*$/) ? document.getElementById("tehai").innerHTML = "<font color=#FF0000 >无效请求</font>" : urlTileString.length && main();
    else {
        var i, html = "", suitType = Math.floor(3 * Math.random()), html = html + "<table cellpadding=0 cellspacing=0 ><tr><td>";
        for (i = 9; i >= 0; --i) {
            var j, tileCount = i > 3 ? 136 : 36, k, tileArr = [], k = 0;
            for (k = 0; k < tileCount; ++k)
                tileArr.push(k);
            for (k = 0; k < tileArr.length - 1; ++k) {
                var l = k + Math.floor(Math.random() * (tileArr.length - k)),
                    temp = tileArr[k];
                tileArr[k] = tileArr[l];
                tileArr[l] = temp;
            }
            var handTiles = tileArr.splice(0, i === 9 ? 4 : i === 8 ? 7 : i === 7 ? 10 : 13).sort(function(a, b) { return a - b; }),
                drawTile = tileArr.splice(0, 1)[0], m, tileString = "";
            for (m = 0; m < handTiles.length; ++m)
                tileString += tileIndexToString(handTiles[m] + (i > 3 ? 0 : 36 * suitType));
            if (drawTile !== -1) {
                tileString += tileIndexToString(drawTile + (i > 3 ? 0 : 36 * suitType));
                handTiles.push(drawTile);
            }
            var shantenArr = calcShantenBoth(handTiles, handTiles.length),
                html = html + ('■<a href="?q=' + normalizeTileString(tileString) + '" class=D >'),
                html = html + shantenTypeDescription(shantenArr, handTiles.length === 14),
                html = html + "<br>";
            for (m = 0; m < tileString.length; m += 2)
                html += createTileImg(tileString.substr(m, 2), m % 6 === 2 && m === tileString.length - 2 ? " hspace=3 " : "");
            html += "</a>";
            html += "<br><br>";
            if (i === 4) document.f.q.value = normalizeTileString(tileString);
        }
        html += "</td></tr></table>";
        document.getElementById("tehai").innerHTML = html;
    }
})();
