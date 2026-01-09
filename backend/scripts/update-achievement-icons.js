const mongoose = require('mongoose');
require('dotenv').config();

// Import model
const { Achievement } = require('../models/GamificationProfile');

// Mapping từ iconify URL sang tên component React
const iconMapping = {
    'https://api.iconify.design/lucide:swords.svg': 'Swords',
    'https://api.iconify.design/lucide:briefcase.svg': 'BriefcaseBusiness',
    'https://api.iconify.design/lucide:graduation-cap.svg': 'GraduationCap',
    'https://api.iconify.design/lucide:book.svg': 'Book',
    'https://api.iconify.design/lucide:crown.svg': 'Crown',
    'https://api.iconify.design/lucide:flame.svg': 'Flame',
    'https://api.iconify.design/lucide:biceps-flexed.svg': 'BicepsFlexed',
    'https://api.iconify.design/lucide:star.svg': 'Star',
    'https://api.iconify.design/lucide:target.svg': 'Target',
    'https://api.iconify.design/lucide:sun.svg': 'Sun',
    'https://api.iconify.design/lucide:handshake.svg': 'Handshake',
};

async function updateIcons() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/your_database');
        console.log('✅ Connected to MongoDB');

        // Lấy tất cả achievements
        const achievements = await Achievement.find({});
        console.log(`📊 Found ${achievements.length} achievements`);

        let updated = 0;
        let skipped = 0;

        for (const achievement of achievements) {
            const newIcon = iconMapping[achievement.icon];
            
            if (newIcon) {
                await Achievement.updateOne(
                    { _id: achievement._id },
                    { $set: { icon: newIcon } }
                );
                console.log(`✅ Updated: ${achievement.name} | ${achievement.icon} → ${newIcon}`);
                updated++;
            } else {
                console.log(`⚠️ Skipped: ${achievement.name} | Unknown icon: ${achievement.icon}`);
                skipped++;
            }
        }

        console.log('\n📈 Summary:');
        console.log(`✅ Updated: ${updated}`);
        console.log(`⚠️ Skipped: ${skipped}`);
        console.log(`📊 Total: ${achievements.length}`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    }
}

// Run the script
updateIcons();
