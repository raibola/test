import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';
import '../index.css';



class Album extends Component {
    constructor(props) {
        super(props);

        const album = albumData.find( album => {
            return album.slug === this.props.match.params.slug
          });
      
          this.state = {
            album: album,
            currentSong: album.songs[0],
            currentTime: 0,
            duration: album.songs[0].duration, 
            isPlaying: false,
            isHovering: false
          };

          this.audioElement = document.createElement('audio');
          this.audioElement.src = album.songs[0].audioSrc;
        }

        play() {
            this.audioElement.play();
            this.setState({ isPlaying: true });
          }

        pause() {
            this.audioElement.pause();
            this.setState({ isPlaying: false });
          }   

        componentDidMount() {
            this.eventListeners = {
                timeupdate: e => {
                  this.setState({ currentTime: this.audioElement.currentTime });
                },
                durationchange: e => {
                  this.setState({ duration: this.audioElement.duration });
                }
              };
              this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
              this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
            }
         
        componentWillUnmount() {
            this.audioElement.src = null;
            this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
            this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
              }
            

        setSong(song) {
            this.audioElement.src = song.audioSrc;
            this.setState({ currentSong: song });
          }
       
        handleSongClick(song) {
            const isSameSong = this.state.currentSong === song;
            if (this.state.isPlaying && isSameSong) {
               this.pause();
              } else {
                if (!isSameSong) { this.setSong(song); }     
                this.play();
              }
          }
        
          handlePrevClick() {
          const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
          const newIndex = Math.max(0, currentIndex - 1);
          const newSong = this.state.album.songs[newIndex];
          this.setSong(newSong);
          this.play();    
        }

        handleNextClick() {
            const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
            const newIndex = Math.min(this.state.album.songs.length - 1, currentIndex + 1);
            const newSong = this.state.album.songs[newIndex];
            this.setSong(newSong);
            this.play();  
          }

        handleTimeChange(e) {
            const newTime = this.audioElement.duration * e.target.value;
            this.audioElement.currentTime = newTime;
            this.setState({ currentTime: newTime });
          }

        handleVolumeChange(e) {
            const newVolume = e.target.value;
            this.audioElement.volume = newVolume;
            this.setState({ currentVolume: newVolume });
        }

        formatTime(time) {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);  

            if (isNaN(time)) {
                return "-:--";
            } else {
                return <span> {minutes}:{seconds > 9 ? seconds : '0' + seconds}</span>;            
            }
        }

      
    
    render() {
      return (
        <section className="album">
         <section id="album-info">
         <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
           <div className="album-details">
             <h1 id="album-title">{this.state.album.title}</h1>
             <h3 className="artist">{this.state.album.artist}</h3>
             <h3 id="release-info">{this.state.album.releaseInfo}</h3>
           </div>
         </section>
         <table id="song-list" align="center">
           <colgroup>
             <col id="song-number-column" />
             <col id="song-title-column" />
             <col id="song-duration-column" />
           </colgroup>  
           <tbody>
            {
              this.state.album.songs.map( (songs, index) =>
              <tr className="song" key={index} onClick={() => this.handleSongClick(songs)} onMouseEnter={() => this.setState({ isHovering: index + 1 })} 
              onMouseLeave={() => this.setState({ isHovering: false })} >
             <td>
                {
                this.state.currentSong === songs && this.state.isHovering ?
                (<span className={this.state.isPlaying ? "ion-pause" : "ion-play"} />) :
                this.state.isHovering === index + 1 ? (<span className="ion-play" />) :
                (<span className="song-number">{index + 1}</span>)
                }
              </td>
              <td>{songs.title}</td>
              <td>{this.formatTime(songs.duration)}</td>
              </tr>
            )
            }
           </tbody>
           </table>
           <footer className="player-bar">
           <PlayerBar
           isPlaying={this.state.isPlaying}
           currentSong={this.state.currentSong}
           currentTime={this.audioElement.currentTime}
           duration={this.audioElement.duration}
           currentVolume={this.audioElement.currentVolume}
           handleVolumeChange={(e) => this.handleVolumeChange(e)}
           handleSongClick={() => this.handleSongClick(this.state.currentSong)}
           handlePrevClick={() => this.handlePrevClick()}
           handleNextClick={() => this.handleNextClick()}
           handleTimeChange={(e) => this.handleTimeChange(e)}
           formatTime={time => this.formatTime(time)}
         />
         </footer>
        </section>
      );
    }
  }

export default Album;