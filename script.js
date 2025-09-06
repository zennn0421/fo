// グローバル変数として全武器データを保持
let allWeapons = [];

document.addEventListener('DOMContentLoaded', () => {
    // フィルター要素を取得
    const rarityFilter = document.getElementById('rarity-filter');
    const typeFilter = document.getElementById('type-filter');

    // フィルターが変更されたら、武器を再表示するイベントを設定
    rarityFilter.addEventListener('change', filterAndDisplayWeapons);
    typeFilter.addEventListener('change', filterAndDisplayWeapons);

    // 初期データを取得
    fetchWeapons();
});

// APIから武器データを取得する非同期関数
async function fetchWeapons() {
    const loader = document.getElementById('loader');
    
    try {
        const response = await fetch('https://fortnite-api.com/v2/weapons/br?language=ja');
        const data = await response.json();
        
        // データをフィルタリングして、表示に必要な武器のみを抽出
        allWeapons = data.data.filter(weapon => 
            weapon.gameplayTags && 
            !weapon.gameplayTags.includes('Gameplay.Source.Event') && // イベント武器を除外
            !weapon.gameplayTags.includes('Gameplay.Source.Creative') && // クリエイティブ武器を除外
            weapon.rarity.id !== 'transcendent' // 不明なレアリティを除外
        );
        
        // 最初の表示
        filterAndDisplayWeapons();
        
    } catch (error) {
        loader.textContent = 'データの読み込みに失敗しました。ページを再読み込みしてください。';
        console.error('Error fetching weapon data:', error);
    } finally {
        // 成功・失敗に関わらずローダーを非表示に
        loader.style.display = 'none';
    }
}

// フィルター条件に基づいて武器を表示する関数
function filterAndDisplayWeapons() {
    const weaponsGrid = document.getElementById('weapons-grid');
    const rarityFilterValue = document.getElementById('rarity-filter').value;
    const typeFilterValue = document.getElementById('type-filter').value;

    // 表示する前にコンテナを空にする
    weaponsGrid.innerHTML = '';

    // フィルター処理
    const filteredWeapons = allWeapons.filter(weapon => {
        const rarityMatch = rarityFilterValue === 'all' || weapon.rarity.id.toLowerCase() === rarityFilterValue;
        const typeMatch = typeFilterValue === 'all' || weapon.type.id.toLowerCase() === typeFilterValue;
        return rarityMatch && typeMatch;
    });

    // フィルターされた武器をカードとして表示
    if (filteredWeapons.length > 0) {
        filteredWeapons.forEach(weapon => {
            const weaponCard = createWeaponCard(weapon);
            weaponsGrid.appendChild(weaponCard);
        });
    } else {
        weaponsGrid.innerHTML = '<p>該当する武器が見つかりませんでした。</p>';
    }
}

// 武器カードのHTML要素を作成する関数
function createWeaponCard(weapon) {
    const card = document.createElement('div');
    const rarity = weapon.rarity.id.toLowerCase();
    card.className = `weapon-card`;

    // 武器の主要な統計情報（存在しない場合があるためチェック）
    const stats = weapon.mainStats;
    const damage = stats ? stats.DmgPB : 'N/A';
    const fireRate = stats ? stats.FireRate : 'N/A';
    const clipSize = stats ? stats.ClipSize : 'N/A';
    const reloadTime = stats ? stats.ReloadTime : 'N/A';

    card.innerHTML = `
        <div class="weapon-image" style="background-image: url('${weapon.images.icon}')"></div>
        <div class="weapon-info ${'rarity-' + rarity}">
            <h2>${weapon.name}</h2>
            <p><strong>レアリティ:</strong> ${weapon.rarity.name}</p>
            <p><strong>種類:</strong> ${weapon.type.name}</p>
            <p><strong>ダメージ:</strong> ${damage}</p>
            <p><strong>連射速度:</strong> ${fireRate}</p>
            <p><strong>マガジン:</strong> ${clipSize}</p>
            <p><strong>リロード:</strong> ${reloadTime}秒</p>
        </div>
    `;
    return card;
}
