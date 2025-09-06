// DOMが読み込まれたら実行
document.addEventListener('DOMContentLoaded', () => {
    fetchWeapons();
});

// Fortnite-API.comから武器データを取得する関数
async function fetchWeapons() {
    const weaponsGrid = document.getElementById('weapons-grid');
    const loadingIndicator = document.getElementById('loading');
    
    try {
        // APIエンドポイント (日本語データを指定)
        const response = await fetch('https://fortnite-api.com/v2/weapons?language=ja');
        const data = await response.json();

        // 読み込み表示を消す
        loadingIndicator.style.display = 'none';

        // 取得した武器データを元にカードを作成
        data.data.forEach(weapon => {
            // 表示したい武器の種類を絞り込む (例: アサルトライフル, ショットガンなど)
            const allowedTypes = ['assault', 'shotgun', 'smg', 'sniper'];
            if (weapon.mainStats && allowedTypes.includes(weapon.type.id)) {
                const weaponCard = createWeaponCard(weapon);
                weaponsGrid.appendChild(weaponCard);
            }
        });

    } catch (error) {
        // エラーが発生した場合の処理
        loadingIndicator.textContent = 'データの読み込みに失敗しました。';
        console.error('Error fetching weapon data:', error);
    }
}

// 武器情報からHTMLのカード要素を作成する関数
function createWeaponCard(weapon) {
    const card = document.createElement('div');
    // レアリティに応じてCSSクラスを追加
    const rarity = weapon.rarity.id.toLowerCase();
    card.className = `weapon-card rarity-${rarity}`;

    // カードの内部HTMLを生成
    card.innerHTML = `
        <img src="${weapon.images.icon}" alt="${weapon.name}">
        <div class="weapon-info">
            <h2 class="rarity-${rarity}">${weapon.name}</h2>
            <p><strong>レアリティ:</strong> ${weapon.rarity.name}</p>
            <p><strong>種類:</strong> ${weapon.type.name}</p>
            <p><strong>ダメージ:</strong> ${weapon.mainStats.DmgPB}</p>
            <p><strong>連射速度:</strong> ${weapon.mainStats.FireRate}</p>
            <p><strong>マガジンサイズ:</strong> ${weapon.mainStats.ClipSize}</p>
        </div>
    `;
    return card;
}