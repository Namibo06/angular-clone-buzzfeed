import { Component, OnInit } from '@angular/core';
import quiz_questions from "../../../assets/data/quiz_questions.json";

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  title:string="";

  questions:any;
  questionSelected:any;

  //coleção para salvar respostas/alias
  answers:string[] =[];
  answerSelect:string="";

  //verificar em qual questão está
  questionIndex:number = 0;
  questionMaxIndex:number=0;

  //para saber se acabou e mostrar a resposta
  finished:boolean=false;

  constructor() { }

  ngOnInit(): void {
    //se estiver na mermória/carregado
    if(quiz_questions){
      this.finished = false;
      //carregando titulo do json
      this.title = quiz_questions.title;

      //salvando coleções de perguntas na nossa variável
      this.questions = quiz_questions.questions;
      //para aparecer sempre a primeira pergunta como selecionada
      this.questionSelected = this.questions[this.questionIndex];

      //forçando começar em zero
      this.questionIndex = 0;
      //pegando total de perguntas
      this.questionMaxIndex = this.questions.length;
    }
  }

  playerChoose(value:string){
    //adicionando opção selecionada no array
    this.answers.push(value);
    //toda vez que salvar uma resposta,vai chamar a função nextStep
    this.nextStep();
    //console.log(this.answers);

  }

  //ir para pr´xoima questão,se não tiver eibir o resultado
  async nextStep(){
    this.questionIndex+=1;
    if(this.questionMaxIndex > this.questionIndex){
      //se o máximo de questões for maior que o ponteiro de questões atual,vai pegar a posição da questão selecionada na qual incrementou
      this.questionSelected = this.questions[this.questionIndex];
    }else{
      //armazenando numa constante,o resultado,esperando a função
      const finalAnswer:string = await this.checkResult(this.answers);
      this.finished=true;
      //verificar opção ganhadora
      //para não dar erro de tipagem porque o any não soube se seria A ou B, foi colocado que o finalAnswer seria a chave do mesmo tipo de quiz_questions.results,ou seja,forçando para garantir que ele somente irá retornar A ou B
      this.answerSelect = quiz_questions.results[finalAnswer as keyof typeof quiz_questions.results];
    }
  }

  async checkResult(answers:string[]){
    //utilizando reduce para saber quantos itens aparecem mais,previous é o anterior,current é o item atual,i é o index,e arr é o array
    const result = answers.reduce((previous,current,i,arr)=>{
      if(arr.filter(item => item === previous).length > arr.filter(item => item === current).length){
        //aqui verifica se o item que é o anterior/que passou "A" tem tamanho maior do que o item atual é o current "B",ai vai guardando

        return previous;
      }
      else{
        return current;
      }
    })
    return result;
  }
}
