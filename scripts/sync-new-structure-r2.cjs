const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const BUCKET = process.env.R2_BUCKET_NAME || "nore-media";
const PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL || "https://pub-c58cdc739b3e41f093d0676c704c7618.r2.dev";

const S3 = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const baseDiskDir = 'D:/Users/Downloads/New folder (2)/Sản phẩm dự án_/Photography & Tài nguyên';

const structure = [
  {
    id: "product",
    title: "Product (Sản phẩm)",
    titleEn: "Product",
    desc: "Nhiếp ảnh sản phẩm thương mại, bao bì cao cấp tĩnh vật và nghệ thuật ẩm thực F&B.",
    descEn: "Commercial product photography, luxury packaging, still life and culinary fine dining.",
    icon: "product",
    diskFolder: "1. Product (Sản phẩm)",
    r2Prefix: "Photography/Product",
    subcategories: [
      {
        id: "baobi-banhtrungthu-lemeridien",
        title: "Bao Bì Bánh Trung Thu - Le Méridien",
        titleEn: "Luxury Mooncake Packaging - Le Méridien",
        desc: "BST hộp quà Trung Thu hoàng gia Le Méridien trên mặt nước, tháp quà phát sáng và vali dạ tiệc.",
        descEn: "Royal mooncake luxury gift set collection on water reflection, glowing tower and party trunks.",
        diskSub: "01_BaoBi_BanhTrungThu_LeMeridien",
        r2Sub: "01_BaoBi_BanhTrungThu_LeMeridien",
        images: [
          {
            file: "01_LeMeridien_Mooncake_ArchesWaterReflection.png",
            title: "BST Hoàng Gia Trên Mặt Nước",
            titleEn: "Royal Collection On Water Reflection"
          },
          {
            file: "02_LeMeridien_Mooncake_LuxuryRedTrunk_WineTea.png",
            title: "Vali Đỏ Sang Trọng & Rượu Vang",
            titleEn: "Luxury Red Trunk With Wine & Tea"
          },
          {
            file: "03_LeMeridien_Mooncake_VerticalTower_GlowingDrawer.png",
            title: "Tháp Quà Phát Sáng Ngân Hà",
            titleEn: "Glowing Drawer Vertical Tower"
          },
          {
            file: "04_LeMeridien_Mooncake_Pedestals_EggYolkDetails.png",
            title: "Chi Tiết Trứng Muối & Bục Trưng Bày",
            titleEn: "Egg Yolk Details On Display Pedestals"
          },
          {
            file: "05_LeMeridien_Mooncake_FloatingTrunks_SpaceOrbit.png",
            title: "Vali Bay Lơ Lửng Đường Chân Trời",
            titleEn: "Floating Luxury Trunks Over Skyline"
          }
        ]
      },
      {
        id: "amthuc-nhahang-fb",
        title: "Ẩm Thực Nhà Hàng & F&B",
        titleEn: "Culinary & Fine Dining F&B",
        desc: "Nghệ thuật ẩm thực fine dining tại Ussina 77, Hilton Residence, Mövenpick, Intercontinental và Lẩu Chay Nhà Nát.",
        descEn: "Fine dining culinary artistry at Ussina 77, Hilton Residence, Mövenpick, Intercontinental and Nha Nat Vegan Hotpot.",
        diskSub: "02_AmThuc_NhaHang_FB",
        r2Sub: "02_AmThuc_NhaHang_FB",
        images: [
          {
            file: "01_Ussina77_Wagyu_SkyDining.jpg",
            title: "Bò Wagyu Ủ Tuyết Trên Mây - Landmark 81",
            titleEn: "Snow-Aged Wagyu Sky Dining Landmark 81"
          },
          {
            file: "02_Hilton_RoastQuail_CharcoalStove.jpg",
            title: "Chim Cút Nướng Khói Lò Than Gốm - Hilton",
            titleEn: "Roast Quail Charcoal Stove Hilton Residence"
          },
          {
            file: "03_Movenpick_PhuQuoc_FreshSpringRolls.jpg",
            title: "Gỏi Cuốn Tôm Tươi Nhiệt Đới - Mövenpick",
            titleEn: "Tropical Fresh Spring Rolls Mövenpick Phu Quoc"
          },
          {
            file: "04_Intercontinental_SeafoodFeast_Boat.jpg",
            title: "Thuyền Hải Sản Khổng Lồ - Intercontinental",
            titleEn: "Seafood Feast Boat Intercontinental Phu Quoc"
          },
          {
            file: "05_LauChayNhaNat_FoodStyling.jpg",
            title: "Food Styling Lẩu Nấm Thanh Tịnh - Nhà Nát",
            titleEn: "Artistic Mushroom Vegan Hotpot Styling Nha Nat"
          }
        ]
      },
      {
        id: "sanpham-congnghe-panasonic",
        title: "Thiết Bị Công Nghệ - Panasonic",
        titleEn: "Technology & Appliances - Panasonic",
        desc: "Nhiếp ảnh thương mại thiết bị công nghệ hiện đại, đường nét tối giản và chi tiết công thái học.",
        descEn: "Commercial photography for modern technology devices, minimal lines and ergonomic details.",
        diskSub: "03_SanPham_CongNghe_Panasonic",
        r2Sub: "03_SanPham_CongNghe_Panasonic",
        images: [
          {
            file: "01_Panasonic_Product_Commercial_Display.png",
            title: "Bố Cục Trưng Bày Thương Mại Panasonic",
            titleEn: "Panasonic Commercial Display Composition"
          },
          {
            file: "02_Panasonic_Device_Hero_Perspective.png",
            title: "Góc Phối Cảnh Hero Tinh Tế",
            titleEn: "Hero Perspective Design Lines"
          },
          {
            file: "03_Panasonic_Device_Front_Sleek.png",
            title: "Góc Chụp Trực Diện Tối Giản",
            titleEn: "Front Sleek Minimal View"
          },
          {
            file: "04_Panasonic_Device_Side_Profile.png",
            title: "Độ Mỏng & Thiết Kế Công Thái Học",
            titleEn: "Side Profile Ergonomic Design"
          },
          {
            file: "05_Panasonic_Device_Angle_Detail.png",
            title: "Cận Cảnh Góc Nghiêng Sắc Nét",
            titleEn: "Angled Detail Close-up"
          }
        ]
      }
    ]
  },
  {
    id: "brand",
    title: "Brand (Thương hiệu)",
    titleEn: "Brand",
    desc: "Nhiếp ảnh kiến trúc không gian khách sạn, resort 5 sao và sự kiện kích hoạt thương hiệu.",
    descEn: "Architecture, 5-star hotel & resort hospitality spaces, and brand activation events.",
    icon: "brand",
    diskFolder: "2. Brand (Thuong hi?u)",
    r2Prefix: "Photography/Brand",
    subcategories: [
      {
        id: "khachsan-resort-porthospitality",
        title: "Khách Sạn & Resort 5 Sao",
        titleEn: "Hospitality & 5-Star Resorts",
        desc: "Không gian kiến trúc nghỉ dưỡng sang trọng tại La Siesta Saigon, The Charm Hồ Tràm, SongBar Hilton, Crowne Plaza & Intercontinental.",
        descEn: "Luxury architecture and hospitality spaces at La Siesta Saigon, The Charm Ho Tram, Hilton SongBar, Crowne Plaza & Intercontinental.",
        diskSub: "01_KhachSan_Resort_PortHospitality",
        r2Sub: "01_KhachSan_Resort_PortHospitality",
        images: [
          {
            file: "01_Lasiesta_Saigon_WineCellar_Dining.jpg",
            title: "Hầm Rượu Kính & Không Gian La Siesta",
            titleEn: "Luxury Glass Wine Cellar La Siesta Saigon"
          },
          {
            file: "02_TheCharm_HoTram_Resort_Architecture.jpg",
            title: "Kiến Trúc Hồ Bơi Vô Cực The Charm Hồ Tràm",
            titleEn: "Infinity Pool Architecture The Charm Ho Tram"
          },
          {
            file: "03_Hilton_SongBar_Atmosphere.jpg",
            title: "Không Gian Quầy Bar Đẳng Cấp SongBar Hilton",
            titleEn: "SongBar Luxury Bar Atmosphere Hilton Saigon"
          },
          {
            file: "04_CrownePlaza_PhuQuoc_Resort_Pool.jpg",
            title: "Nghỉ Dưỡng Ven Hồ Bơi Crowne Plaza Phú Quốc",
            titleEn: "Resort Poolside Space Crowne Plaza Starbay"
          },
          {
            file: "05_Intercontinental_Beachside_Venue.jpg",
            title: "Tiệc Bãi Biển Hoàng Hôn Intercontinental",
            titleEn: "Sunset Beachside Venue Intercontinental"
          }
        ]
      },
      {
        id: "sukien-brandactivation-eastwest",
        title: "Sự Kiện Kích Hoạt - East West Brewing",
        titleEn: "Brand Activation - East West Brewing",
        desc: "Chuỗi khoảnh khắc kích hoạt lễ hội bia thủ công Oktoberfest: dàn đèn sân khấu, vại bia bọt mịn, merch và cụng ly kết nối.",
        descEn: "Oktoberfest craft beer activation series: stage lighting, beer steins, merch booth and guest toasts.",
        diskSub: "02_SuKien_BrandActivation_EastWest",
        r2Sub: "02_SuKien_BrandActivation_EastWest",
        images: [
          {
            file: "01_EastWest_Oktoberfest_WelcomePG_Standee.jpg",
            title: "PG Đón Khách Bên Standee Oktoberfest",
            titleEn: "Welcome PG With Oktoberfest Standee"
          },
          {
            file: "02_EastWest_Oktoberfest_GrandHall_StageLighting.jpg",
            title: "Đèn Sân Khấu & Bồn Ủ Bia Hoành Tráng",
            titleEn: "Grand Hall Stage Lighting & Brewing Tanks"
          },
          {
            file: "03_EastWest_Oktoberfest_Bartender_TwoBeerSteins.jpg",
            title: "Bartender Nâng Hai Vại Bia Sánh Bọt",
            titleEn: "Bartender With Two Oktoberfest Beer Steins"
          },
          {
            file: "04_EastWest_Oktoberfest_CraftBeer_MerchBooth.jpg",
            title: "Quầy Trưng Bày Merch & Ly Bia GoodBeerOnly",
            titleEn: "Merchandise Booth & Signature Glassware"
          },
          {
            file: "05_EastWest_Oktoberfest_Guests_Cheer_Toast.jpg",
            title: "Khoảnh Khắc Cụng Ly Khách Mời & Đối Tác",
            titleEn: "Guests Cheers & Community Celebration"
          }
        ]
      },
      {
        id: "chiendich-thoitrang-oldnavy",
        title: "Chiến Dịch Thời Trang - Old Navy",
        titleEn: "Fashion Campaign - Old Navy",
        desc: "Chiến dịch quảng cáo mùa hè gia đình phong cách California: dạo biển, activewear và phong cách sống tự do phóng khoáng.",
        descEn: "California lifestyle summer family campaign: beachside casual, activewear and carefree moments.",
        diskSub: "03_ChienDich_ThoiTrang_OldNavy",
        r2Sub: "03_ChienDich_ThoiTrang_OldNavy",
        images: [
          {
            file: "01_OldNavy_Family_Resort_Lifestyle.jpg",
            title: "Thời Trang Gia Đình Nghỉ Dưỡng Resort",
            titleEn: "Family Resort Vacation Lifestyle"
          },
          {
            file: "02_OldNavy_Summer_Couple_Posing.jpg",
            title: "Cặp Đôi Dạo Biển Mùa Hè Trẻ Trung",
            titleEn: "Summer Couple Beachside Posing"
          },
          {
            file: "03_OldNavy_Kids_Fun_Playful.jpg",
            title: "Năng Lượng Tinh Nghịch Thời Trang Trẻ Em",
            titleEn: "Kids Cheerful Summer Energy"
          },
          {
            file: "04_OldNavy_Activewear_Outdoor.jpg",
            title: "Bộ Sưu Tập Activewear Ngoài Trời",
            titleEn: "Outdoor Activewear Collection"
          },
          {
            file: "05_OldNavy_Casual_Beachside_Style.jpg",
            title: "Thời Trang Thường Ngày Phóng Khoáng California",
            titleEn: "California Casual Beachside Style"
          }
        ]
      }
    ]
  },
  {
    id: "personal",
    title: "Cá nhân (Chân dung & Lookbook)",
    titleEn: "Personal (Portrait & Lookbook)",
    desc: "Nhiếp ảnh chân dung nghệ thuật cổ phong di sản, dạ hội Haute Couture và lookbook Y2K.",
    descEn: "Heritage fine art portraits, haute couture evening gowns and Y2K streetwear lookbook.",
    icon: "personal",
    diskFolder: "3. C nhn (Chn dung & Lookbook)",
    r2Prefix: "Photography/CaNhan",
    subcategories: [
      {
        id: "chandung-cophong-aoyem",
        title: "Cổ Phong Di Sản (Áo Yếm Lụa)",
        titleEn: "Heritage Fine Art (Silk Bodice)",
        desc: "Concept áo yếm lụa truyền thống, quạt thư pháp, sảnh gỗ hoài cổ và phiên bản đen trắng Cinematic.",
        descEn: "Traditional silk bodice, calligraphy fan, antique heritage hall and cinematic B&W.",
        diskSub: "01_ChanDung_CoPhong_AoYem",
        r2Sub: "01_ChanDung_CoPhong_AoYem",
        images: [
          {
            file: "01_CoPhong_CloseUp_BeautyFan_Calligraphy.jpg",
            title: "Chân Dung Beauty Cầm Quạt Đỏ",
            titleEn: "Beauty Portrait With Calligraphy Fan"
          },
          {
            file: "02_CoPhong_Temple_SilkDress_MorningSunbeam.jpg",
            title: "Áo Yếm Lụa Bên Vạt Nắng Sớm",
            titleEn: "Silk Bodice In Morning Sunbeams"
          },
          {
            file: "03_CoPhong_FullLength_HeritageHall_Staircase.jpg",
            title: "Toàn Thân Tại Sảnh Gỗ Di Sản",
            titleEn: "Full-Length In Heritage Wooden Hall"
          },
          {
            file: "04_CoPhong_Editorial_AntiqueWoodChairs_Paintings.jpg",
            title: "Editorial Bên Ghế Gỗ Cẩn Xà Cừ",
            titleEn: "Editorial Beside Antique Wood Chairs"
          },
          {
            file: "05_CoPhong_Cinematic_BW_Courtyard_Columns.jpg",
            title: "Cinematic B&W Hàng Cột Sân Đình",
            titleEn: "Cinematic B&W Courtyard Columns"
          }
        ]
      },
      {
        id: "thoitrang-dahoi-bason",
        title: "Thời Trang Dạ Hội - Ga Ba Son Metro",
        titleEn: "Haute Couture - Ba Son Metro",
        desc: "Đầm dạ hội Haute Couture đỏ rực xẻ sâu, thang cuốn ngầm ga Ba Son, hiệu ứng lăng kính và ánh sáng đô thị tương phản.",
        descEn: "Haute couture scarlet evening gown, Ba Son underground metro escalator, prism flare and urban night lights.",
        diskSub: "02_ThoiTrang_DaHoi_BaSon",
        r2Sub: "02_ThoiTrang_DaHoi_BaSon",
        images: [
          {
            file: "01_Final_CoutureRedGown_BlondeModel_EscalatorPortrait.jpg",
            title: "Chân Dung Thang Cuốn Kính Đầm Đỏ",
            titleEn: "Escalator Portrait In Red Couture Gown"
          },
          {
            file: "02_Final_DiagonalPose_MetroEscalator_Architecture.jpg",
            title: "Dáng Chéo Kiến Trúc Thang Cuốn",
            titleEn: "Diagonal Architecture Pose Metro Escalator"
          },
          {
            file: "03_Final_BaSonMetro_PrismFlare_DreamyCitylights.jpg",
            title: "Lăng Kính Prism Flare Mơ Màng",
            titleEn: "Dreamy Prism Flare Ba Son Station"
          },
          {
            file: "04_Final_BaSonMetroStation_Symmetrical_GrandEntrance.jpg",
            title: "Khung Hình Đối Xứng Cổng Ga Metro",
            titleEn: "Symmetrical Grand Entrance Ba Son Metro"
          },
          {
            file: "05_Final_DynamicFlowingGown_NightCityLights.jpg",
            title: "Tà Váy Tung Bay Ánh Đèn Đêm",
            titleEn: "Dynamic Flowing Gown With City Lights"
          }
        ]
      },
      {
        id: "lookbook-duongpho-y2k",
        title: "Lookbook Đường Phố Y2K",
        titleEn: "Y2K Streetwear Lookbook",
        desc: "Phong cách streetwear Y2K năng động tại Cầu Ba Son, tường neon đỏ graffiti và xưởng công nghiệp denim 501.",
        descEn: "Dynamic Y2K streetwear at Ba Son Bridge, neon graffiti wall and vintage denim 501 industrial warehouse.",
        diskSub: "03_Lookbook_DuongPho_Y2K",
        r2Sub: "03_Lookbook_DuongPho_Y2K",
        images: [
          {
            file: "01_Look2_BaSonBridge_RiversideSkyline_Outdoor.jpg",
            title: "Bến Tàu Skyline Cầu Ba Son",
            titleEn: "Ba Son Bridge Skyline Riverside Outdoor"
          },
          {
            file: "02_Look2_RedNeon_GraffitiWall_HairFlip.jpg",
            title: "Hất Tóc Tường Neon Graffiti",
            titleEn: "Red Neon Graffiti Wall Hair Flip"
          },
          {
            file: "03_Look2_Warehouse_Denim501_PlayfulPose.jpg",
            title: "Áo Denim 501 Xưởng Công Nghiệp",
            titleEn: "Denim 501 Industrial Warehouse Playful Pose"
          },
          {
            file: "04_Look2_LowAngle_Sunlight_IndustrialSet.jpg",
            title: "Góc Thấp Đón Nắng Công Nghiệp",
            titleEn: "Low Angle Natural Sunlight Industrial Set"
          },
          {
            file: "05_Look2_ConfidentAttitude_VintageWindows.jpg",
            title: "Thần Thái Tự Tin Ô Cửa Vintage",
            titleEn: "Confident Attitude Vintage Window Grid"
          }
        ]
      }
    ]
  }
];

// Helper to find actual disk directory case-insensitively
function findMatchingDir(parent, pattern) {
  const items = fs.readdirSync(parent, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory()) {
      if (item.name.toLowerCase().includes(pattern.toLowerCase())) {
        return path.join(parent, item.name);
      }
    }
  }
  return path.join(parent, pattern);
}

async function main() {
  console.log('=== SYNCING 3 CHỦ ĐỀ x 3 MỤC NHỎ x 5 ẢNH (45 ẢNH) LÊN R2 & WEB ===\n');

  const finalOutput = [];
  let totalProcessed = 0;
  let totalOrigBytes = 0;
  let totalThumbBytes = 0;
  let totalLargeBytes = 0;

  for (const cat of structure) {
    const matchedCatDir = findMatchingDir(baseDiskDir, cat.id === 'product' ? 'Product' : (cat.id === 'brand' ? 'Brand' : 'Cá nhân'));
    console.log(`\n========================================`);
    console.log(`📁 Danh mục: ${cat.title} [Folder: ${matchedCatDir}]`);
    console.log(`========================================`);

    const finalCat = {
      id: cat.id,
      title: cat.title,
      titleEn: cat.titleEn,
      desc: cat.desc,
      descEn: cat.descEn,
      icon: cat.icon,
      subcategories: []
    };

    for (const sub of cat.subcategories) {
      const matchedSubDir = findMatchingDir(matchedCatDir, sub.diskSub);
      console.log(`\n  📂 [${sub.id}] ${sub.title} [Folder: ${matchedSubDir}]`);

      const finalSub = {
        id: sub.id,
        title: sub.title,
        titleEn: sub.titleEn,
        desc: sub.desc,
        descEn: sub.descEn,
        images: []
      };

      for (const img of sub.images) {
        totalProcessed++;
        const filePath = path.join(matchedSubDir, img.file);
        if (!fs.existsSync(filePath)) {
          throw new Error(`File not found: ${filePath}`);
        }

        const fileBuffer = fs.readFileSync(filePath);
        const origSize = fileBuffer.length;
        totalOrigBytes += origSize;

        // Base name without extension
        const ext = path.extname(img.file);
        const nameWithoutExt = path.basename(img.file, ext);

        const thumbKey = `${cat.r2Prefix}/${sub.r2Sub}/${nameWithoutExt}_thumb.webp`;
        const largeKey = `${cat.r2Prefix}/${sub.r2Sub}/${nameWithoutExt}_large.webp`;

        console.log(`    [${totalProcessed}/45] ${img.file} (${(origSize / 1024 / 1024).toFixed(2)} MB)...`);

        // Generate Thumb WebP (width 900px, quality 80)
        const thumbBuffer = await sharp(fileBuffer)
          .resize({ width: 900, withoutEnlargement: true })
          .webp({ quality: 80, effort: 4 })
          .toBuffer();
        totalThumbBytes += thumbBuffer.length;

        // Generate Large WebP (width 2000px, quality 85)
        const largeBuffer = await sharp(fileBuffer)
          .resize({ width: 2000, withoutEnlargement: true })
          .webp({ quality: 85, effort: 4 })
          .toBuffer();
        totalLargeBytes += largeBuffer.length;

        // Upload thumb to R2
        await S3.send(new PutObjectCommand({
          Bucket: BUCKET,
          Key: thumbKey,
          Body: thumbBuffer,
          ContentType: 'image/webp',
          CacheControl: 'public, max-age=31536000, immutable',
        }));

        // Upload large to R2
        await S3.send(new PutObjectCommand({
          Bucket: BUCKET,
          Key: largeKey,
          Body: largeBuffer,
          ContentType: 'image/webp',
          CacheControl: 'public, max-age=31536000, immutable',
        }));

        const thumbUrl = `${PUBLIC_BASE_URL}/${thumbKey}`;
        const largeUrl = `${PUBLIC_BASE_URL}/${largeKey}`;

        console.log(`      ✓ Thumb: ${(thumbBuffer.length / 1024).toFixed(1)} KB | Large: ${(largeBuffer.length / 1024).toFixed(1)} KB`);

        finalSub.images.push({
          url: largeUrl,
          key: largeKey,
          title: img.title,
          titleEn: img.titleEn,
          thumbUrl: thumbUrl,
          thumbKey: thumbKey
        });
      }

      finalCat.subcategories.push(finalSub);
    }

    finalOutput.push(finalCat);
  }

  // Save new photography.json
  const jsonPath = path.resolve(__dirname, '../src/data/photography.json');
  fs.writeFileSync(jsonPath, JSON.stringify(finalOutput, null, 2), 'utf8');

  console.log('\n=============================================');
  console.log('🎉 TOÀN BỘ 45 TẤM HÌNH ĐÃ ĐỒNG BỘ THÀNH CÔNG LÊN R2 & WEB!');
  console.log(`- Tổng dung lượng gốc: ${(totalOrigBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`- Tổng dung lượng Thumb WebP (lưới web): ${(totalThumbBytes / 1024 / 1024).toFixed(2)} MB (Giảm ${((1 - totalThumbBytes / totalOrigBytes) * 100).toFixed(1)}%)`);
  console.log(`- Tổng dung lượng Large WebP (lightbox): ${(totalLargeBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`- Đã cập nhật src/data/photography.json!`);
}

main().catch(err => {
  console.error('Lỗi quá trình đồng bộ:', err);
  process.exit(1);
});
