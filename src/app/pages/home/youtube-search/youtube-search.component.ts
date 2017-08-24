import { Component, OnInit } from '@angular/core';
import { YoutubeService } from '../../../services/youtube.service';

@Component({
  selector: 'app-youtube-search',
  templateUrl: './youtube-search.component.html',
  styleUrls: ['./youtube-search.component.scss']
})
export class YoutubeSearchComponent implements OnInit {

  nextPageToken: string;
  prevPageToken: string;
  ytIDSelected: string;
  items: [any];
  totalN: number;
  searchTerm: string = '';
  pageSize: number = 4;
  pageIndex: number = 0;
  pageSizeOptions: [number] = [2, 4, 6, 8, 10];
  selectedId: string ='';
  selectedIndex: number;
  titleOfSelected: string ='';

  player: YT.Player;


  constructor(
    private youtubeService: YoutubeService) {}

  ngOnInit() {
  }

  searchYt(q,token){
    this.youtubeService.search(q,this.pageSize,token)
    .then((res)=>{
      console.log(res);
      this.nextPageToken = res.nextPageToken;
      this.prevPageToken = res.prevPageToken;
      this.items = res.items;
      this.totalN = res.pageInfo.totalResults;
    });
  }

  pageChange(pageRef){
    if(pageRef.pageSize !== this.pageSize){
      console.log('pageSize changed');
      this.pageSize = pageRef.pageSize;
      this.searchYt(this.searchTerm, undefined);
    }
    if(this.pageIndex !== pageRef.pageIndex){
      if(pageRef.pageIndex > this.pageIndex){
        console.log('pageIndex increased');
        this.searchYt(this.searchTerm, this.nextPageToken);
      }
      else{
        console.log('pageIndex decreased');
        this.searchYt(this.searchTerm, this.prevPageToken);
      }
      this.pageIndex = pageRef.pageIndex;
      this.selectedIndex = undefined;
    }

  }

  select(i){
    this.selectedId = this.items[i].id.videoId;
    this.selectedIndex = i;
    this.titleOfSelected = this.items[i].snippet.title;
    console.log(this.selectedIndex);
    if(this.player){
      this.player.loadVideoById(this.selectedId);
    }
    else{
      setTimeout(()=>{
        if(this.player){this.player.playVideo();}
      },1500);
    }
  }

  savePlayer (player) {
    this.player = player;
    console.log('player instance', player)
  }
  onStateChange(event){
    console.log('player state', event.data);
  }

  playVideo() {
    this.player.playVideo();
  }

  pauseVideo() {
    this.player.pauseVideo();
  }

}
