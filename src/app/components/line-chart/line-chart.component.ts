import {
  Component, OnInit, Input, OnChanges,
  SimpleChange
} from '@angular/core';
import {Entry} from '../vertical-bar-chart/entry.model';
import {getDayOfTheWeek} from '../../utils/utils';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit, OnChanges {

  multi: any[] = [];
  @Input() height: number;
  @Input() width: number;
  @Input() weeklyEventsData: any;
  @Input() monthlyEventsData: any;
  @Input() showPeriod: string;
  weeklyEntries: any[];
  monthlyEntries: any[];
  period: string;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = false;
  xAxisLabel = 'Country';
  showYAxisLabel = false;
  yAxisLabel = 'Population';

  colorScheme = {
    domain: ['#3EC556', '#ED684A']
  };

  // line, area
  autoScale = true;

  constructor() {
    Object.assign(this, {multi: this.multi});
  }

  onSelect(event) {
    console.log(event);
  }

  ngOnInit() {
  }

  ngOnChanges(changes: {[ propName: string]: SimpleChange}) {

    if (
      changes['weeklyEventsData']
      && changes['weeklyEventsData'].previousValue !== changes['weeklyEventsData'].currentValue ) {
        this.period = 'Week';
        this.populateBarGraphData(changes['weeklyEventsData'].currentValue);
        this.multi = this.weeklyEntries;
    }
    if (
      changes['monthlyEventsData']
      && changes['monthlyEventsData'].previousValue !== changes['monthlyEventsData'].currentValue ) {
        this.period = 'Month';
        this.populateBarGraphData(changes['monthlyEventsData'].currentValue);
    }

    if ( changes['showPeriod'] && changes['showPeriod'].previousValue !== changes['showPeriod'].currentValue ) {
      this.showPeriod = changes['showPeriod'].currentValue;
      if (this.showPeriod === 'Month') {
        if (this.monthlyEntries) {
          this.multi = this.monthlyEntries;
        }
      } else if (this.showPeriod === 'Week') {
        if (this.weeklyEntries) {
          this.multi = this.weeklyEntries;
        }
      }
    }
  }

  public populateBarGraphData(appSummary: any) {
    const eventsDictionary = {};
    const keys = [];
    if (appSummary) {
      for (let i = 0; i < appSummary.length; i++) {
        const seriesDictionary = {};
        const formattedDate = (appSummary[i].dateTime).substring(0, 10);
        const day = new Date(formattedDate);
        const value = appSummary[i].occurrences;
        const key = appSummary[i].name;

        if (!(key in eventsDictionary)) {
          eventsDictionary[key] = seriesDictionary;
          keys.push(key);
        }
        eventsDictionary[key][day.getDate()] = value;
      }
      this.extrapolateValuesBasedOnDate(eventsDictionary, keys);
    }
  }

  public extrapolateValuesBasedOnDate(dictionary: {}, keys: string[]) {
    const entries = this.selectEntries ();

    for (let keyIterator = 0; keyIterator < keys.length; keyIterator++) {
      const key = keys[keyIterator];
      const serie = dictionary[key];
      entries.push(
        {
          'name': key,
          'series': this.getEventSeriesData(serie)
        });
    }
  }

  public selectEntries () {
    if (this.period === 'Week') {
      this.weeklyEntries = [];
      return this.weeklyEntries;
    } else if (this.period === 'Month') {
      this.monthlyEntries = [];
      return this.monthlyEntries;
    }
  }

  public getEventSeriesData (dictionary: {}) {
    const series = [];
    const date = new Date();
    let iteratorLimit = 7;
    if (this.period === 'Month') {
      iteratorLimit = 30;
    }
    for (let iterator = 0; iterator < iteratorLimit; iterator++) {
      date.setDate(date.getDate() - 1);
      const key = date.getDate();
      if (!(key in dictionary)) {
        dictionary[key] = 0;
      }
    }
    for (let dayIterator = iteratorLimit; dayIterator > 0; dayIterator--) {
      const day = new Date(new Date().getDate());

      day.setDate(new Date().getDate() - dayIterator);
      const dayDate = day.getDate();
      const dayKey = this.getDayKey(day);
      series.push(new Entry(dayKey, dictionary[dayDate]));
    }
    return series;
  }

  public getDayKey (day) {
    if (this.period === 'Week') {
      return getDayOfTheWeek(day.getDay());
    } else if (this.period === 'Month') {
      return day.getDate();
    }
  }

}
