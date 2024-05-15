import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {

  public gifsList: Gif[] = []

  private _tagsHistory: string[] = []
  private apiKey: string = 'pGaV59pIV4z6B7Tr2NJiG60fzbXb10Cw'

  constructor(private http: HttpClient) {
    this.loadLocalStorage()
   }

  get tagsHistory() {
    return [...this._tagsHistory]
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase()

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter(oldTag => oldTag !== tag)
    }

    this._tagsHistory.unshift(tag)
    this._tagsHistory = this.tagsHistory.splice(0, 10)
    this.saveLocalStorage()
  }

  private saveLocalStorage():void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory))
  }

  private loadLocalStorage():void {
    if(!localStorage.getItem('history')) return
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!)
    this.searchTag(this._tagsHistory[0])
  }

  searchTag(tag: string): void {
    if (!tag) return
    this.organizeHistory(tag)

    this.http.get<SearchResponse>(`https://api.giphy.com/v1/gifs/search?api_key=${this.apiKey}&q=${tag}&limit=10`)
      .subscribe((res) => {
        this.gifsList = res.data
      })
  }

}
