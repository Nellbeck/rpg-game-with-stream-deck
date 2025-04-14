"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemRarity = exports.ItemType = void 0;
var ItemType;
(function (ItemType) {
    ItemType["WEAPON"] = "weapon";
    ItemType["ARMOR"] = "armor";
    ItemType["POTION"] = "potion";
    ItemType["SCROLL"] = "scroll";
    ItemType["TREASURE"] = "treasure";
    ItemType["QUEST_ITEM"] = "quest_item";
})(ItemType || (exports.ItemType = ItemType = {}));
var ItemRarity;
(function (ItemRarity) {
    ItemRarity["COMMON"] = "common";
    ItemRarity["UNCOMMON"] = "uncommon";
    ItemRarity["RARE"] = "rare";
    ItemRarity["EPIC"] = "epic";
    ItemRarity["LEGENDARY"] = "legendary";
})(ItemRarity || (exports.ItemRarity = ItemRarity = {}));
