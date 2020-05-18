import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CategoryService } from '../../categories/shared/category.service';
import { EntryService } from '../../entries/shared/entry.service';

import currencyFormatter from "currency-formatter";
import { Category } from '../../categories/shared/category.model';
import { Entry } from '../../entries/shared/entry.model';
import * as moment from 'moment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  expenseTotal: any = 0;
  revenueTotal: any = 0;
  balance: any = 0;

  expenseChartData: any;
  revenueChartData: any;

  chartOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  categories: Category[] = [];
  entries: Entry[] = [];

  @ViewChild('month') month: ElementRef = null;
  @ViewChild('year') year: ElementRef = null;

  constructor(
    private categoryService: CategoryService,
    private entryService: EntryService) {
  }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    );
  }


  generateReports() {
    const month = this.month.nativeElement.value
    const year  = this.year.nativeElement.value;

    if(!month || !year) {
      alert('Você precisa selecionar o mês e ano!');  
    } else {
      this.entryService.getByMonthAndYear(month, year).subscribe(this.setValues.bind(this));
    }
  }

  // private methods 
  private setValues(entries: Entry[]) {
    this.entries = entries;
    this.calculateBalance();
    this.handleCharts();
  }

  private handleCharts() {
    this.revenueChartData = this.getChatData('revenue', '#9CCC65', 'Receitas por categoria');
    this.expenseChartData = this.getChatData('expense', '#D70000', 'Despesas por categoria');
  }

  private calculateBalance() {
    let expenseTotal = 0;
    let revenueTotal = 0;  
  
    this.entries.forEach(entry => {
      const entryAmount = currencyFormatter.unformat(entry.amount, { code: 'BRL'});
      if(entry.type == 'expense') {
        expenseTotal += entryAmount;
      } else {
        revenueTotal += entryAmount;
      }
    });
    
    this.expenseTotal = currencyFormatter.format(expenseTotal, { code : 'BRL'} );
    this.revenueTotal = currencyFormatter.format(revenueTotal, { code : 'BRL'} );
    this.balance = currencyFormatter.format(revenueTotal - expenseTotal, { code: 'BRL'});
  }

  private getChatData(entryType: string, backgroundColor: string, chartTitle: string) {
    const chartData = [];
    this.categories.forEach(category => {
      // filtrando lançamentos pela categoria e tipo
      const filteredEntries = this.entries.filter(
        entry => (entry.categoryId == category._id) && (entry.type == entryType)
      )  
    
      // se encontrou lançamentos para a categoria do contexto
      if(filteredEntries.length) {
        // totaliza os valores da categoria
        const totalAmount = filteredEntries.reduce(
          (total, entry) => total + currencyFormatter.unformat(entry.amount, {code: 'BRL'}), 0
        )
      
        chartData.push({
          categoryName: category.name, 
          totalAmount: totalAmount
        });
      }
    });
    
    return {
      labels: chartData.map(item => item.categoryName),
      datasets: [{
        label: chartTitle,
        backgroundColor: backgroundColor,
        data: chartData.map(item => item.totalAmount)
      }]  
    };
  }

}
