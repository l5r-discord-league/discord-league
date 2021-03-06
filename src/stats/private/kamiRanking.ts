/*
<form>

<P>

Input probability matrix P

(P<sub>ij</sub>, transition probability from i to j.):

<BR>

<textarea id="TEXTAREA1" name="textin" rows="20" style="width:100%;">

0.6 0.4

0.3 0.7

</textarea>

<P>

<input onclick="b_clk(this.form)" type="button" value="calculate" name="b">

probability vector in stable state:

<BR>

<textarea name="textout" rows="10" style="width:100%;">

</textarea>

<P>

<input onclick="c_clk(this.form)" type="button" value="calculate" name="c">

<input type="text" size="3" value="2" name="textin2">

'th power of probability matrix

<BR>

<textarea name="textout2" rows="20" style="width:100%;"></textarea>

</form>


<script type="text/javascript">

<!--

  function init()

  {

    //document.forms[0].textin.value="0.6 0.4\n0.3 0.7";

    //document.forms[0].textin2.value="2";

  }

  function b_clk(form)

  {

    form.textout.value = markov(form.textin.value);

  }

  function c_clk(form)

  {

    form.textout2.value = mpower(form.textin.value, form.textin2.value);

  }


  function mpower(c, v)

  {

    var p=to_matrix(c);

    var n=p.length;

    var pp=new Array(n);

    var sum=new Array(n);

    var i,j,k,l;

    for (i=0; i<n; i++) {

       pp[i]=new Array(n);

       sum[i]=new Array(n);

       for (j=0; j<n; j++) {

          pp[i][j]=p[i][j];

          sum[i][j]=0;

       }

    }

    for (l=1; l<v; l++) {

      for (i=0; i<n; i++)

      for (j=0; j<n; j++)

        sum[i][j]=0;


      for (i=0; i<n; i++)

      for (j=0; j<n; j++)

      for (k=0; k<n; k++)

        sum[i][j]+=pp[i][k]*p[k][j];


      for (i=0; i<n; i++)

      for (j=0; j<n; j++)

        pp[i][j]=sum[i][j];

    }

    return print2dmf(pp, 2)

  }

  function replaceall(str,c,cc)

  {

    while(str.indexOf(c) > -1)

      str=str.replace(c,cc);

  }

  function to_matrix(c)

  {

    //obtain array p[][] from strings c

    var i,j;

    var cin=c;

    replaceall(cin,"\t"," ");

    replaceall(cin,","," ");

    replaceall(cin,"  "," ");


    var n=0;

    var cl=cin.split("\n");

    for (i=0; i<cl.length; i++) {

      while(cl[i].indexOf(" ") == 0)

        cl[i]=cl[i].replace(" ","");

      //replaceall(cl[i],"\r","*");

      //replaceall(cl[i],"\n","**");

      //alert(cl[i]+cl[i].length);

      if (cl[i].length <= 1)

        break;

      var cc=cl[i].split(" ");

      n++;

      //if (cc.length <= 0)

      //  break;

      //n=i+1;

    }


    var p=new Array(n);

    for (i=0; i<n; i++) {

       p[i]=new Array(n);

       var cc=cl[i].split(" ");

       for (j=0; j<n; j++)

          p[i][j]=Number(cc[j]);

    }

    return p;

  }

  function markov(c)

  {

    var i,j;

    var p=to_matrix(c);

    var n=p.length;


    //alert("p=\n"+print2dm(p,n,n));


    //add normalization condition

    m=n+1;

    var a=new Array(m);

    for (i=0; i<m; i++) {

      a[i]=new Array(m);

        for (j=0; j<m; j++)

          a[i][j]=0;

    }


    for (j=0; j<m; j++)

      a[0][j]=1;


    //copy transverse of p-1 to a

    for (i=0; i<n; i++)

       for (j=0; j<n; j++) {

          if (i!=j)

            a[i+1][j]=p[j][i];

          else

            a[i+1][j]=p[j][i]-1;

       }


    //alert("a=\n"+print2dm(a,m,m));



    var f=new Array(n);

    gaussj(a,n,f);

    return print1dmf(f, 3);

  }


  function print1dm(a)

  {

    return print1dmf(a,-1);

  }

  function print1dmf(a, l)

  {

    //var res = "n=" + String(a.length) + "\n\n";

    var i,j;

    var res="";

    for (i=0; i<a.length; i++)

        res += String(i+1)+": " + pfmt(a[i],l)+"\n";

    return res;

  }


  function print2dm(a)

  {

    return print2dmf(a,-1);

  }

  function print2dmf(a, l)

  {

    var i,j,k;

    var res="";

    for (i=0; i<a.length; i++) {

      for (j=0; j<a[i].length; j++)

        res += pfmt(a[i][j],l)+" ";

      res += "\n";

    }

    return res;

  }

  function pfmt(v, l)

  {

    if (l<0)

       return String(v);


    var i;

    var a=1;

    for (i=0; i<l; i++)

      a *= 10;


    var s = String(Math.round(v*a)/a);

    for (i=0; i<l+2-s.length; i++)

      s += " ";

    return s;

  }

  function gaussj(a,n,f)

  {

    var m=n+1;

    var i,j,k;


    //implicit pivoting

    for (i=0; i<m; i++) {

      amx=Math.abs(a[i][0]);

      for (j=1; j<n; j++) {

        if (amx < Math.abs(a[i][j]) )

          amx=Math.abs(a[i][j]);

      }

      for (j=0; j<m; j++)

        a[i][j] /= amx;

    }


    for (i=0; i<n; i++) {

      //alert("i="+String(i));

      //select pivot

      if (i>0) {

        var r=i;

        for (k=i+1; k<m; k++) {

          if ( Math.abs(a[r][i]) < Math.abs(a[k][i]) )

            r=k;

        }

        //alert("piot="+r);


        for (j=0; j<m; j++) {

          t=a[i][j];

          a[i][j]=a[r][j];

          a[r][j]=t;

        }

      }


      //normalize line i

      var d = a[i][i];

      for (j=i; j<m; j++)

        a[i][j] /= d;


      //alert("ai2=\n"+print2dm(a));


      //subtract line i from k!=i.

      for (k=0; k<m; k++) {

        if(k != i) {

          d=a[k][i];

          for (j=i; j<m; j++)

            a[k][j] -= d*a[i][j];

        }

      }

      //alert("ai3=\n"+print2dm(a));

    }


    for (i=0; i<n; i++)

      f[i]=a[i][m-1];


    return;

  }

//

-->

</script>

</P>

*/
