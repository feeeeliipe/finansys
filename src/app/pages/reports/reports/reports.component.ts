import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CategoryService } from '../../categories/shared/category.service';
import { EntryService } from '../../entries/shared/entry.service';

import currencyFormatter from "currency-formatter";
import { Category } from '../../categories/shared/category.model';
import { Entry } from '../../entries/shared/entry.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import toastr from 'toastr';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  expenseTotal: any = currencyFormatter.format(0, { code : 'BRL'} );
  revenueTotal: any = currencyFormatter.format(0, { code : 'BRL'} );
  balance: any = currencyFormatter.format(0, { code : 'BRL'} );
  balanceMessage = '';

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

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  }

  categories: Category[] = [];
  entries: Entry[] = [];
  
  filtersForm: FormGroup;
  
  constructor(
    private categoryService: CategoryService,
    private entryService: EntryService, 
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    
    const now = new Date();
    var firstDay = new Date(now.getFullYear(), now.getMonth(), 1); 
    var lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0); 
    
    this.filtersForm = this.fb.group({
      initialDueDate: [firstDay], 
      finalDueDate: [lastDay]
    });

    this.filtersForm.controls['initialDueDate'].valueChanges.subscribe(value => {
      const lastDayOfMonth = new Date(value.getFullYear(), value.getMonth() + 1, 0);
      this.filtersForm.controls['finalDueDate'].setValue(lastDayOfMonth);
    });
    
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    );

    this.generateReports();
  }


  generateReports() {
    const initialDueDate = this.filtersForm.controls['initialDueDate'].value;
    const finalDueDate  = this.filtersForm.controls['finalDueDate'].value;

    if(!initialDueDate || !finalDueDate) {
      toastr.error('É necessário informar as datas para busca das informações!');
    } else {
      this.entryService.getByPeriod(initialDueDate, finalDueDate).subscribe(this.setValues.bind(this));
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
    const balance = revenueTotal - expenseTotal;
    if(balance > 0) {
      this.balanceMessage = 'Ufa, sobrou uma grana! :)';
    } else if(balance == 0) {
      this.balanceMessage = 'Não sobrou, mas também não faltou : |';
    } else {
      this.balanceMessage = 'Deu ruim, faltou grana!';
    }
    this.balance = currencyFormatter.format(balance, { code: 'BRL'});
  }

  private getChatData(entryType: string, backgroundColor: string, chartTitle: string) {
    const chartData = [];
    this.categories.forEach(category => {
      // filtrando lançamentos pela categoria e tipo
      const filteredEntries = this.entries.filter(
        entry => (entry.category._id == category._id) && (entry.type == entryType)
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
