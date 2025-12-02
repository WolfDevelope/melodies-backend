import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Song from '../models/Song.js';
import Artist from '../models/Artist.js';
import Album from '../models/Album.js';

dotenv.config();

// Helper function to find or create artist
const findOrCreateArtist = async (artistData) => {
  let artist = await Artist.findOne({ name: artistData.name });
  if (!artist) {
    artist = await Artist.create(artistData);
  }
  return artist;
};

// Helper function to find or create album
const findOrCreateAlbum = async (albumData) => {
  let album = await Album.findOne({ title: albumData.title, artist: albumData.artist });
  if (!album) {
    album = await Album.create(albumData);
  }
  return album;
};

const hotSongs = [
  // Taylor Swift
  {
    artist: { name: 'Taylor Swift', genre: 'Pop', bio: 'American singer-songwriter' },
    album: { title: 'Midnights', genre: 'Pop', releaseDate: '2022-10-21' },
    song: { title: 'Anti-Hero', genre: 'Pop', duration: '3:20', releaseDate: '2022-10-21' }
  },
  {
    artist: { name: 'Taylor Swift', genre: 'Pop', bio: 'American singer-songwriter' },
    album: { title: 'Midnights', genre: 'Pop', releaseDate: '2022-10-21' },
    song: { title: 'Lavender Haze', genre: 'Pop', duration: '3:22', releaseDate: '2022-10-21' }
  },
  {
    artist: { name: 'Taylor Swift', genre: 'Pop', bio: 'American singer-songwriter' },
    album: { title: 'Midnights', genre: 'Pop', releaseDate: '2022-10-21' },
    song: { title: 'Karma', genre: 'Pop', duration: '3:24', releaseDate: '2022-10-21' }
  },

  // The Weeknd
  {
    artist: { name: 'The Weeknd', genre: 'R&B', bio: 'Canadian singer and songwriter' },
    album: { title: 'After Hours', genre: 'R&B', releaseDate: '2020-03-20' },
    song: { title: 'Blinding Lights', genre: 'Pop', duration: '3:20', releaseDate: '2019-11-29' }
  },
  {
    artist: { name: 'The Weeknd', genre: 'R&B', bio: 'Canadian singer and songwriter' },
    album: { title: 'Starboy', genre: 'R&B', releaseDate: '2016-11-25' },
    song: { title: 'Starboy', genre: 'R&B', duration: '3:50', releaseDate: '2016-09-21' }
  },

  // Ed Sheeran
  {
    artist: { name: 'Ed Sheeran', genre: 'Pop', bio: 'English singer-songwriter' },
    album: { title: 'Subtract', genre: 'Pop', releaseDate: '2023-05-05' },
    song: { title: 'Eyes Closed', genre: 'Pop', duration: '3:18', releaseDate: '2023-03-24' }
  },
  {
    artist: { name: 'Ed Sheeran', genre: 'Pop', bio: 'English singer-songwriter' },
    album: { title: 'Equals', genre: 'Pop', releaseDate: '2021-10-29' },
    song: { title: 'Shivers', genre: 'Pop', duration: '3:27', releaseDate: '2021-09-10' }
  },
  {
    artist: { name: 'Ed Sheeran', genre: 'Pop', bio: 'English singer-songwriter' },
    album: { title: 'Divide', genre: 'Pop', releaseDate: '2017-03-03' },
    song: { title: 'Shape of You', genre: 'Pop', duration: '3:53', releaseDate: '2017-01-06' }
  },

  // Harry Styles
  {
    artist: { name: 'Harry Styles', genre: 'Pop', bio: 'English singer and actor' },
    album: { title: "Harry's House", genre: 'Pop', releaseDate: '2022-05-20' },
    song: { title: 'As It Was', genre: 'Pop', duration: '2:47', releaseDate: '2022-04-01' }
  },
  {
    artist: { name: 'Harry Styles', genre: 'Pop', bio: 'English singer and actor' },
    album: { title: "Harry's House", genre: 'Pop', releaseDate: '2022-05-20' },
    song: { title: 'Music For a Sushi Restaurant', genre: 'Pop', duration: '3:13', releaseDate: '2022-05-20' }
  },

  // Dua Lipa
  {
    artist: { name: 'Dua Lipa', genre: 'Pop', bio: 'English and Albanian singer' },
    album: { title: 'Future Nostalgia', genre: 'Pop', releaseDate: '2020-03-27' },
    song: { title: 'Levitating', genre: 'Pop', duration: '3:23', releaseDate: '2020-03-27' }
  },
  {
    artist: { name: 'Dua Lipa', genre: 'Pop', bio: 'English and Albanian singer' },
    album: { title: 'Future Nostalgia', genre: 'Pop', releaseDate: '2020-03-27' },
    song: { title: "Don't Start Now", genre: 'Pop', duration: '3:03', releaseDate: '2019-11-01' }
  },

  // Ariana Grande
  {
    artist: { name: 'Ariana Grande', genre: 'Pop', bio: 'American singer and actress' },
    album: { title: 'Positions', genre: 'R&B', releaseDate: '2020-10-30' },
    song: { title: 'Positions', genre: 'R&B', duration: '2:52', releaseDate: '2020-10-23' }
  },
  {
    artist: { name: 'Ariana Grande', genre: 'Pop', bio: 'American singer and actress' },
    album: { title: 'Thank U, Next', genre: 'Pop', releaseDate: '2019-02-08' },
    song: { title: '7 rings', genre: 'Pop', duration: '2:58', releaseDate: '2019-01-18' }
  },

  // Billie Eilish
  {
    artist: { name: 'Billie Eilish', genre: 'Pop', bio: 'American singer-songwriter' },
    album: { title: 'Happier Than Ever', genre: 'Pop', releaseDate: '2021-07-30' },
    song: { title: 'Happier Than Ever', genre: 'Pop', duration: '4:58', releaseDate: '2021-07-30' }
  },
  {
    artist: { name: 'Billie Eilish', genre: 'Pop', bio: 'American singer-songwriter' },
    album: { title: 'When We All Fall Asleep, Where Do We Go?', genre: 'Pop', releaseDate: '2019-03-29' },
    song: { title: 'bad guy', genre: 'Pop', duration: '3:14', releaseDate: '2019-03-29' }
  },

  // Olivia Rodrigo
  {
    artist: { name: 'Olivia Rodrigo', genre: 'Pop', bio: 'American singer-songwriter and actress' },
    album: { title: 'SOUR', genre: 'Pop', releaseDate: '2021-05-21' },
    song: { title: 'drivers license', genre: 'Ballad', duration: '4:02', releaseDate: '2021-01-08' }
  },
  {
    artist: { name: 'Olivia Rodrigo', genre: 'Pop', bio: 'American singer-songwriter and actress' },
    album: { title: 'SOUR', genre: 'Pop', releaseDate: '2021-05-21' },
    song: { title: 'good 4 u', genre: 'Rock', duration: '2:58', releaseDate: '2021-05-14' }
  },
  {
    artist: { name: 'Olivia Rodrigo', genre: 'Pop', bio: 'American singer-songwriter and actress' },
    album: { title: 'GUTS', genre: 'Rock', releaseDate: '2023-09-08' },
    song: { title: 'vampire', genre: 'Pop', duration: '3:39', releaseDate: '2023-06-30' }
  },

  // Post Malone
  {
    artist: { name: 'Post Malone', genre: 'Rap', bio: 'American rapper and singer' },
    album: { title: 'Hollywood\'s Bleeding', genre: 'Rap', releaseDate: '2019-09-06' },
    song: { title: 'Circles', genre: 'Pop', duration: '3:35', releaseDate: '2019-08-30' }
  },
  {
    artist: { name: 'Post Malone', genre: 'Rap', bio: 'American rapper and singer' },
    album: { title: 'Austin', genre: 'Rap', releaseDate: '2023-07-28' },
    song: { title: 'Chemical', genre: 'Rock', duration: '3:06', releaseDate: '2023-04-14' }
  },

  // Drake
  {
    artist: { name: 'Drake', genre: 'Rap', bio: 'Canadian rapper and singer' },
    album: { title: 'Certified Lover Boy', genre: 'Rap', releaseDate: '2021-09-03' },
    song: { title: 'Way 2 Sexy', genre: 'Rap', duration: '4:15', releaseDate: '2021-09-03' }
  },
  {
    artist: { name: 'Drake', genre: 'Rap', bio: 'Canadian rapper and singer' },
    album: { title: 'Honestly, Nevermind', genre: 'EDM', releaseDate: '2022-06-17' },
    song: { title: 'Sticky', genre: 'EDM', duration: '3:58', releaseDate: '2022-06-17' }
  },

  // SZA
  {
    artist: { name: 'SZA', genre: 'R&B', bio: 'American singer-songwriter' },
    album: { title: 'SOS', genre: 'R&B', releaseDate: '2022-12-09' },
    song: { title: 'Kill Bill', genre: 'R&B', duration: '2:33', releaseDate: '2022-12-09' }
  },
  {
    artist: { name: 'SZA', genre: 'R&B', bio: 'American singer-songwriter' },
    album: { title: 'SOS', genre: 'R&B', releaseDate: '2022-12-09' },
    song: { title: 'Snooze', genre: 'R&B', duration: '3:22', releaseDate: '2022-12-09' }
  },

  // Miley Cyrus
  {
    artist: { name: 'Miley Cyrus', genre: 'Pop', bio: 'American singer and actress' },
    album: { title: 'Endless Summer Vacation', genre: 'Pop', releaseDate: '2023-03-10' },
    song: { title: 'Flowers', genre: 'Pop', duration: '3:20', releaseDate: '2023-01-13' }
  },

  // Sam Smith
  {
    artist: { name: 'Sam Smith', genre: 'Pop', bio: 'English singer and songwriter' },
    album: { title: 'Gloria', genre: 'Pop', releaseDate: '2023-01-27' },
    song: { title: 'Unholy', genre: 'Pop', duration: '2:36', releaseDate: '2022-09-22' }
  },

  // Adele
  {
    artist: { name: 'Adele', genre: 'Pop', bio: 'English singer-songwriter' },
    album: { title: '30', genre: 'Pop', releaseDate: '2021-11-19' },
    song: { title: 'Easy On Me', genre: 'Ballad', duration: '3:44', releaseDate: '2021-10-15' }
  },

  // Bruno Mars
  {
    artist: { name: 'Bruno Mars', genre: 'Pop', bio: 'American singer-songwriter' },
    album: { title: '24K Magic', genre: 'R&B', releaseDate: '2016-11-18' },
    song: { title: '24K Magic', genre: 'R&B', duration: '3:46', releaseDate: '2016-10-07' }
  },

  // Justin Bieber
  {
    artist: { name: 'Justin Bieber', genre: 'Pop', bio: 'Canadian singer' },
    album: { title: 'Justice', genre: 'Pop', releaseDate: '2021-03-19' },
    song: { title: 'Peaches', genre: 'R&B', duration: '3:18', releaseDate: '2021-03-19' }
  },

  // Shawn Mendes
  {
    artist: { name: 'Shawn Mendes', genre: 'Pop', bio: 'Canadian singer-songwriter' },
    album: { title: 'Wonder', genre: 'Pop', releaseDate: '2020-12-04' },
    song: { title: 'Wonder', genre: 'Pop', duration: '2:27', releaseDate: '2020-10-02' }
  },

  // Doja Cat
  {
    artist: { name: 'Doja Cat', genre: 'Pop', bio: 'American rapper and singer' },
    album: { title: 'Planet Her', genre: 'Pop', releaseDate: '2021-06-25' },
    song: { title: 'Woman', genre: 'Pop', duration: '2:52', releaseDate: '2021-06-25' }
  },
  {
    artist: { name: 'Doja Cat', genre: 'Pop', bio: 'American rapper and singer' },
    album: { title: 'Planet Her', genre: 'Pop', releaseDate: '2021-06-25' },
    song: { title: 'Kiss Me More', genre: 'Pop', duration: '3:28', releaseDate: '2021-04-09' }
  },

  // Lil Nas X
  {
    artist: { name: 'Lil Nas X', genre: 'Rap', bio: 'American rapper and singer' },
    album: { title: 'MONTERO', genre: 'Rap', releaseDate: '2021-09-17' },
    song: { title: 'MONTERO (Call Me By Your Name)', genre: 'Rap', duration: '2:17', releaseDate: '2021-03-26' }
  },

  // Coldplay
  {
    artist: { name: 'Coldplay', genre: 'Rock', bio: 'British rock band' },
    album: { title: 'Music of the Spheres', genre: 'Rock', releaseDate: '2021-10-15' },
    song: { title: 'Higher Power', genre: 'Rock', duration: '3:31', releaseDate: '2021-05-07' }
  },

  // Imagine Dragons
  {
    artist: { name: 'Imagine Dragons', genre: 'Rock', bio: 'American pop rock band' },
    album: { title: 'Mercury - Acts 1 & 2', genre: 'Rock', releaseDate: '2022-07-01' },
    song: { title: 'Bones', genre: 'Rock', duration: '2:45', releaseDate: '2022-03-11' }
  },

  // OneRepublic
  {
    artist: { name: 'OneRepublic', genre: 'Pop', bio: 'American pop rock band' },
    album: { title: 'Human', genre: 'Pop', releaseDate: '2021-08-27' },
    song: { title: 'Run', genre: 'Pop', duration: '3:04', releaseDate: '2021-05-05' }
  },

  // Maroon 5
  {
    artist: { name: 'Maroon 5', genre: 'Pop', bio: 'American pop rock band' },
    album: { title: 'Jordi', genre: 'Pop', releaseDate: '2021-06-11' },
    song: { title: 'Beautiful Mistakes', genre: 'Pop', duration: '3:47', releaseDate: '2021-03-03' }
  },

  // The Chainsmokers
  {
    artist: { name: 'The Chainsmokers', genre: 'EDM', bio: 'American DJ and production duo' },
    album: { title: 'So Far So Good', genre: 'EDM', releaseDate: '2022-05-13' },
    song: { title: 'High', genre: 'EDM', duration: '3:38', releaseDate: '2022-01-28' }
  },

  // Calvin Harris
  {
    artist: { name: 'Calvin Harris', genre: 'EDM', bio: 'Scottish DJ and producer' },
    album: { title: 'Funk Wav Bounces Vol. 2', genre: 'EDM', releaseDate: '2022-08-05' },
    song: { title: 'Stay With Me', genre: 'EDM', duration: '3:23', releaseDate: '2022-07-15' }
  },

  // David Guetta
  {
    artist: { name: 'David Guetta', genre: 'EDM', bio: 'French DJ and producer' },
    album: { title: 'Single', genre: 'EDM', releaseDate: '2022-08-26' },
    song: { title: "I'm Good (Blue)", genre: 'EDM', duration: '2:55', releaseDate: '2022-08-26' }
  },

  // Lewis Capaldi
  {
    artist: { name: 'Lewis Capaldi', genre: 'Pop', bio: 'Scottish singer-songwriter' },
    album: { title: 'Broken By Desire To Be Heavenly Sent', genre: 'Pop', releaseDate: '2023-05-19' },
    song: { title: 'Forget Me', genre: 'Ballad', duration: '2:58', releaseDate: '2023-09-09' }
  },

  // Lizzo
  {
    artist: { name: 'Lizzo', genre: 'Pop', bio: 'American singer and rapper' },
    album: { title: 'Special', genre: 'Pop', releaseDate: '2022-07-15' },
    song: { title: 'About Damn Time', genre: 'Pop', duration: '3:11', releaseDate: '2022-04-14' }
  },

  // Rihanna
  {
    artist: { name: 'Rihanna', genre: 'Pop', bio: 'Barbadian singer' },
    album: { title: 'Single', genre: 'R&B', releaseDate: '2023-02-10' },
    song: { title: 'Lift Me Up', genre: 'R&B', duration: '3:17', releaseDate: '2022-10-28' }
  },

  // Beyoncé
  {
    artist: { name: 'Beyoncé', genre: 'R&B', bio: 'American singer and actress' },
    album: { title: 'Renaissance', genre: 'EDM', releaseDate: '2022-07-29' },
    song: { title: 'Break My Soul', genre: 'EDM', duration: '4:38', releaseDate: '2022-06-20' }
  },

  // Selena Gomez
  {
    artist: { name: 'Selena Gomez', genre: 'Pop', bio: 'American singer and actress' },
    album: { title: 'Rare', genre: 'Pop', releaseDate: '2020-01-10' },
    song: { title: 'Lose You to Love Me', genre: 'Pop', duration: '3:26', releaseDate: '2019-10-23' }
  },

  // Camila Cabello
  {
    artist: { name: 'Camila Cabello', genre: 'Pop', bio: 'Cuban-American singer' },
    album: { title: 'Familia', genre: 'Pop', releaseDate: '2022-04-08' },
    song: { title: 'Bam Bam', genre: 'Pop', duration: '3:26', releaseDate: '2022-03-04' }
  },

  // Charlie Puth
  {
    artist: { name: 'Charlie Puth', genre: 'Pop', bio: 'American singer-songwriter' },
    album: { title: 'Charlie', genre: 'Pop', releaseDate: '2022-10-07' },
    song: { title: 'Light Switch', genre: 'Pop', duration: '3:05', releaseDate: '2022-01-20' }
  },

  // Niall Horan
  {
    artist: { name: 'Niall Horan', genre: 'Pop', bio: 'Irish singer-songwriter' },
    album: { title: 'The Show', genre: 'Pop', releaseDate: '2023-06-09' },
    song: { title: 'Heaven', genre: 'Pop', duration: '3:18', releaseDate: '2023-02-17' }
  },

  // Zayn
  {
    artist: { name: 'Zayn', genre: 'R&B', bio: 'English singer' },
    album: { title: 'Nobody Is Listening', genre: 'R&B', releaseDate: '2021-01-15' },
    song: { title: 'Vibez', genre: 'R&B', duration: '4:29', releaseDate: '2021-01-08' }
  },
];

const seedHotSongs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    let createdCount = 0;
    let skippedCount = 0;

    for (const item of hotSongs) {
      try {
        // Find or create artist
        const artist = await findOrCreateArtist(item.artist);

        // Find or create album
        const albumData = {
          ...item.album,
          artist: artist._id,
          coverImage: '', // To be filled later
        };
        const album = await findOrCreateAlbum(albumData);

        // Check if song already exists
        const existingSong = await Song.findOne({ 
          title: item.song.title, 
          artist: artist._id 
        });

        if (existingSong) {
          console.log(`⏭️  Skipped: ${item.song.title} - ${artist.name} (already exists)`);
          skippedCount++;
          continue;
        }

        // Create song
        const songData = {
          ...item.song,
          artist: artist._id,
          album: album._id,
          image: '', // To be filled later
          src: '', // To be filled later
          plays: Math.floor(Math.random() * 10000000), // Random plays
          likes: Math.floor(Math.random() * 1000000), // Random likes
        };

        await Song.create(songData);
        console.log(`✅ Created: ${item.song.title} - ${artist.name}`);
        createdCount++;

      } catch (error) {
        console.error(`❌ Error processing ${item.song.title}:`, error.message);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`✅ Successfully created: ${createdCount} songs`);
    console.log(`⏭️  Skipped (already exist): ${skippedCount} songs`);
    console.log(`📝 Total processed: ${hotSongs.length} songs`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding hot songs:', error);
    process.exit(1);
  }
};

seedHotSongs();
